import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { WebView } from 'react-native-webview';

type MapPoint = {
  id: string;
  name: string;
  address: string;
  price: number;
  area: number;
  available: boolean;
  latitude: number;
  longitude: number;
};

const GOONG_MAPTILES_KEY = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY?.trim() || '';

type GoongStyle = 'light' | 'dark' | 'satellite';

const GOONG_STYLE_ASSET: Record<GoongStyle, string> = {
  light: 'goong_map_web',
  dark: 'goong_map_dark',
  satellite: 'goong_map',
};

export function PropertyMap({ points, onSelect }: { points: MapPoint[]; onSelect: (id: string) => void }) {
  const [mapStyle, setMapStyle] = useState<GoongStyle>('light');
  const [mapError, setMapError] = useState<string>('');

  const initialCenter = useMemo(() => {
    const first = points[0];
    if (!first) {
      return {
        lat: 10.7769,
        lng: 106.7009,
        zoom: 12,
      };
    }

    return {
      lat: first.latitude,
      lng: first.longitude,
      zoom: 14,
    };
  }, [points]);

  const tileUrl = useMemo(
    () => `https://tiles.goong.io/assets/${GOONG_STYLE_ASSET[mapStyle]}/{z}/{x}/{y}.png?api_key=${GOONG_MAPTILES_KEY}`,
    [mapStyle],
  );

  const html = useMemo(() => {
    const payload = JSON.stringify(points);

    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
      body { overflow: hidden; background: #f8fafc; font-family: Arial, sans-serif; }
      #map { background: #e2e8f0; }
      .leaflet-container { font: 12px/1.4 Arial, sans-serif; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      (function () {
        const token = ${JSON.stringify(GOONG_MAPTILES_KEY)};
        const tileUrl = ${JSON.stringify(tileUrl)};
        const points = ${payload};

        const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[ch] || ch));

        const post = (payload) => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
        };

        if (!token) {
          document.body.innerHTML = '<div style="padding:16px;color:#b91c1c">Thieu EXPO_PUBLIC_GOONG_MAPTILES_KEY</div>';
          post({ type: 'map-error', message: 'Missing EXPO_PUBLIC_GOONG_MAPTILES_KEY' });
          return;
        }

        if (!window.L) {
          document.body.innerHTML = '<div style="padding:16px;color:#b91c1c">Leaflet JS khong tai duoc</div>';
          post({ type: 'map-error', message: 'Leaflet library failed to load' });
          return;
        }

        const map = L.map('map', {
          zoomControl: true,
          attributionControl: true,
        }).setView([${initialCenter.lat}, ${initialCenter.lng}], ${initialCenter.zoom});

        const tiles = L.tileLayer(tileUrl, {
          maxZoom: 20,
          tileSize: 256,
          crossOrigin: true,
          detectRetina: true,
          attribution: '&copy; Goong Maps'
        });

        tiles.on('tileerror', function (e) {
          post({ type: 'map-error', message: 'Tile load failed', src: e && e.tile && e.tile.src ? e.tile.src : '' });
        });

        tiles.addTo(map);

        points.forEach((p) => {
          const marker = L.marker([p.latitude, p.longitude]).addTo(map);

          const statusText = p.available ? 'Con phong' : 'Tam het phong';
          const statusColor = p.available ? '#16a34a' : '#ef4444';
          const priceText = Number(p.price || 0).toLocaleString('vi-VN') + ' VND/thang';
          const areaText = Number(p.area || 0) + 'm2';

          marker.bindPopup(
            '<div style="font-family:sans-serif;min-width:220px;max-width:260px;padding:2px">' +
              '<div style="font-size:15px;font-weight:700;color:#0f172a">' + esc(p.name || 'Phong tro') + '</div>' +
              '<div style="font-size:12px;color:#64748b;margin-top:4px">' + esc(p.address || '') + '</div>' +
              '<div style="margin-top:10px;font-size:16px;font-weight:700;color:#0284c7">' + esc(priceText) + '</div>' +
              '<div style="margin-top:4px;font-size:12px;color:#475569">Dien tich: ' + esc(areaText) + '</div>' +
              '<div style="margin-top:6px;display:inline-block;padding:3px 8px;border-radius:999px;background:#f8fafc;border:1px solid #e2e8f0;color:' + statusColor + ';font-size:12px;font-weight:600">' + esc(statusText) + '</div>' +
              '<div style="margin-top:10px">' +
                '<button onclick="window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type: \'marker-select\', id: \'' + esc(p.id) + '\'}))" style="width:100%;border:0;border-radius:8px;padding:8px 10px;background:#0ea5e9;color:white;font-weight:700;font-size:12px">Xem chi tiet</button>' +
              '</div>' +
            '</div>'
          );

          marker.on('click', function () {
            post({ type: 'marker-select', id: p.id });
          });
        });

        post({ type: 'map-ready' });

        setTimeout(function () {
          map.invalidateSize();
        }, 60);
      })();
    </script>
  </body>
</html>`;
  }, [initialCenter.lat, initialCenter.lng, initialCenter.zoom, points, tileUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.styleRow}>
        <Pressable
          style={[styles.styleButton, mapStyle === 'light' && styles.styleButtonActive]}
          onPress={() => setMapStyle('light')}
        >
          <ThemedText style={mapStyle === 'light' ? styles.styleTextActive : styles.styleText}>Light</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.styleButton, mapStyle === 'dark' && styles.styleButtonActive]}
          onPress={() => setMapStyle('dark')}
        >
          <ThemedText style={mapStyle === 'dark' ? styles.styleTextActive : styles.styleText}>Dark</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.styleButton, mapStyle === 'satellite' && styles.styleButtonActive]}
          onPress={() => setMapStyle('satellite')}
        >
          <ThemedText style={mapStyle === 'satellite' ? styles.styleTextActive : styles.styleText}>Satellite</ThemedText>
        </Pressable>
      </View>

      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        thirdPartyCookiesEnabled
        onError={(event) => {
          setMapError(event.nativeEvent.description || 'WebView load error');
        }}
        onHttpError={(event) => {
          setMapError(`WebView HTTP error: ${event.nativeEvent.statusCode}`);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data || '{}') as {
              type?: string;
              id?: string;
              message?: string;
              src?: string;
            };
            if (data.type === 'marker-select' && data.id) {
              onSelect(data.id);
              return;
            }
            if (data.type === 'map-error') {
              setMapError(data.message ? `${data.message}${data.src ? `\n${data.src}` : ''}` : 'Map resource error');
              return;
            }
            if (data.type === 'map-ready') {
              setMapError('');
            }
          } catch {
            // Ignore malformed payloads from webview.
          }
        }}
      />

      {!!mapError && (
        <View style={styles.errorBox}>
          <ThemedText style={styles.errorText}>Map error: {mapError}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  styleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  styleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  styleButtonActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  styleText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
  },
  styleTextActive: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  map: {
    height: 280,
    borderRadius: 14,
    overflow: 'hidden',
  },
  errorBox: {
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
  },
});

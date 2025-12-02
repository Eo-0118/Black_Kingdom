// src/screens/MapScreen.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const KAKAO_JS_KEY = '여기에_카카오_JAVASCRIPT_KEY_붙여넣기';

export default function MapScreen() {
  const html = useMemo(
    () => `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <style>
            html, body, #map {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          </style>
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.onload = function () {
              kakao.maps.load(function () {
                var container = document.getElementById('map');
                var options = {
                  // 서울 시청 근처
                  center: new kakao.maps.LatLng(37.5665, 126.9780),
                  level: 3
                };
                var map = new kakao.maps.Map(container, options);

                // 샘플 마커 1개
                var markerPosition = new kakao.maps.LatLng(37.5665, 126.9780);
                var marker = new kakao.maps.Marker({ position: markerPosition });
                marker.setMap(map);
              });
            };
          </script>
        </body>
      </html>
    `,
    []
  );

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  webview: { flex: 1 },
});
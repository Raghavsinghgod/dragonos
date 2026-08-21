#!/bin/bash
set -u
cd isolate
fail=0
upload() {
  local p="$1"; local u="$2"; local ct="$3"
  for attempt in 1 2 3; do
    if curl --fail --silent --show-error -X PUT -H "Content-Type: $ct" --upload-file "$p" "$u"; then
      return 0
    fi
    sleep 1
  done
  echo "UPLOAD FAILED: $p" >&2
  return 1
}
upload 'assets/index-Bt6scRTX.css' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/assets/index-Bt6scRTX.css?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0c8bab0fd3c1511737c2b4fa8900759f56b9229cbf6c1181b25a42640cc02007' 'text/css; charset=utf-8' || fail=1
upload 'assets/framer-motion-j99QkFjP.js' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/assets/framer-motion-j99QkFjP.js?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=67f4d0217c30ef60fe96b9e2e4fcb46a67613bd246934eaa06632dbfe6183da7' 'application/javascript; charset=utf-8' || fail=1
upload 'assets/react-vendor-Bj3LDE8x.js' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/assets/react-vendor-Bj3LDE8x.js?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=1805835501a026a0ba0ef0a3f215e2402ca45c1af93d100433c9a00fa96b3bae' 'application/javascript; charset=utf-8' || fail=1
upload 'assets/index-BOjqqdYH.js' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/assets/index-BOjqqdYH.js?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0098c5ee89fd1fd5b24fca98049e50e0043ff059a2c92673bcdb738f687253cd' 'application/javascript; charset=utf-8' || fail=1
upload 'index.html' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/index.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=81eacb0c475b099569dad344c450682ee0ef4f5c5d3ebdd10956e48b840100c4' 'text/html; charset=utf-8' || fail=1
upload 'logo.svg' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/logo.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=a7fadc00aa04bd51b9fff3802047d931072d2cb623b6d109ef9e1b4e1902fb83' 'image/svg+xml' || fail=1
upload 'manifest.webmanifest' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/manifest.webmanifest?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=e1ddf184b73cc7270329f238139912d4b77b8c9a5e530edaf31a2a9ed37ac1ad' 'application/octet-stream' || fail=1
upload 'dragon-wallpaper.jpg' 'https://a9a61f4066a65870b4f28656e7bf85b5.r2.cloudflarestorage.com/screenshot-service/distBuild/curvy-cameras-pay/dragon-wallpaper.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1f2a9ff009cb08e6c51fea61588aef7a%2F20260821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260821T201407Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=12a3083bd3b88962894650c025a9bf4c1d223e1298862239c1b064dfcc896264' 'image/jpeg' || fail=1
exit "$fail"

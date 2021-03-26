# build midway server code
midway-bin build -c

# build web ui code
cd web-ui && icejs build --config build.config.js

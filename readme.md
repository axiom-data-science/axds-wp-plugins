# AXDS-WP-PLUGINS

## Development Mode

There are TWO development modes:

1. `npm run dev` - What you'd expect. (Faster)

2. `npm run wp-dev` - Let's you see changes in your local Wordpress site. (Slower)

Suggested plugin workflow:

- In `multi-wordpress/`: `docker-compose up` to start the local WP site.
- In `multi-wordpress/plugins/axds-wp-plugins`, `npm run dev` for fast React development.
- In `multi-wordpress/plugins/axds-wp-plugins`, `npm run wp-dev` and occassionally check that the plugin in showing up correctly within the local Wordpress site.

## Submodule

This thingy is a Git submodule. It has its own Git history. But you develop this plugin while inside of `mult-wordpress/plugins/axds-wp-plugins/`. When you push from within the plugin, it does not affect the parent repo. You're welcome.

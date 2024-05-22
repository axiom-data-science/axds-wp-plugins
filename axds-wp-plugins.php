<?php
/**
 * @package axds-wp-plugins
 * @version 0.1.0
 */
/*
Plugin Name: Axiom WP Plugins
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description:
Author: steven@axds.co
Version: 0.1.0
*/

// Global variable to store all the widget attributes
$widgets = array();

// $tag: the name of the shortcode
function shortcode( $atts = [], $content = null, $tag = '') {
	$id = uniqid("widget_");
	$atts = array_change_key_case( (array) $atts, CASE_LOWER );
	$widget_parameters = array(
		'id' => $id,
		'type' => $tag,
		'parameters' => $atts
	);
	$GLOBALS['widgets'][$id] = $widget_parameters;
	add_parameters();
	return "<div id='" . $id . "'>" . $id . "</div>";
}

add_shortcode('widget_1', 'shortcode');
add_shortcode('widget_2', 'shortcode');
add_shortcode('sensor', 'shortcode');

function add_parameters() {
	wp_localize_script( 'axds-wp-plugins', 'widgets', $GLOBALS['widgets'] ); //localize script to pass PHP data to JS
}

// add the react script
add_action('wp_enqueue_scripts', 'enq_axds_wp_plugins');
function enq_axds_wp_plugins(){
	wp_register_script(
		'axds-wp-plugins',
		plugin_dir_url( __FILE__ ) . '/dist/main.js',
		['wp-element'],
		rand(), // Change this to null for production
		true
	);

	wp_enqueue_script( 'axds-wp-plugins' );
	add_parameters();
}
?>

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

$parameters = array();
$widgets = array();

function debug_to_console($data) {
	$output = $data;
	if (is_array($output))
			$output = implode(',', $output);

	echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

function axds_wp_plugins( $atts = [] ) {
	// echo "<script>console.log('plugins');</script>";
	// normalize attribute keys, lowercase
  $atts = array_change_key_case( (array) $atts, CASE_LOWER );

  // override default attributes with user attributes
	$axds_wp_plugins_atts = shortcode_atts(
		array(
			'plot_type' => 'scatter',
			'station_id' => '1',
			'sensor_id' => '1'
		), $atts
	);

	$current_user = wp_get_current_user();

	$data = array( 
		'email' => $current_user->user_email,
		'params' => $axds_wp_plugins_atts
	);
	
	$GLOBALS['parameters']['axds_wp_plugins_params'] = $data;
	add_parameters();
}

function shortcode( $atts = [], $content = null, $tag = '') {
	$id = uniqid("widget_");
	$widget_parameters = array(
		'id' => $id,
		'type' => $tag,
		'parameters' => $atts
	);
	$GLOBALS['widgets'][$id] = $widget_parameters;
	add_parameters();
	return "<div id='" . $id . "'>" . $id . "</div>";
}

function shortcode_2( $atts = [] ) {
	// echo "<script>console.log('shortcode_2');</script>";
	$data = array( 
		's2' => 's2'
	);
	$GLOBALS['parameters']['s2'] = $data;
	add_parameters();
}


add_shortcode('widget_1', 'shortcode');
add_shortcode('widget_2', 'shortcode');
add_shortcode('axds_wp_plugins', 'axds_wp_plugins');

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

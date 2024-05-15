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


function axds_wp_plugins( $atts = [] ) { 
	// normalize attribute keys, lowercase
  $atts = array_change_key_case( (array) $atts, CASE_LOWER );

  // override default attributes with user attributes
	$axds_wp_plugins_atts = shortcode_atts(
		array(
			'plot_type' => 'scatter',
			'station_id' => '1',
		), $atts
	);

	$current_user = wp_get_current_user();
	$data = array( 
		'email' => $current_user->user_email,
		'params' => $axds_wp_plugins_atts,
	);
  wp_localize_script( 'axds-wp-plugins', 'axds_wp_plugins_params', $data ); //localize script to pass PHP data to JS
	ob_start();
	?>
    <div id="axds-wp-plugins-root"></div>
	<?php return ob_get_clean();
}
// register shortcode
add_shortcode('axds_wp_plugins', 'axds_wp_plugins'); 

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
}
?>

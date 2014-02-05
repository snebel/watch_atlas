/*
 * Created  : Thu 03 Jan 2013 05:43:15 PM EST
 * Modified : Tue 08 Jan 2013 01:32:50 PM EST
 * Author   : GI <gi1242+js@nospam.com> (replace nospam with gmail)
 *
 * Copyright 2013, GI.
 * Licensed under the MIT licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 * Persistent tool tips: Tool tips close after a delay, unless the user is
 * hovering over the tool tip. In this case the tool tip will close when the
 * mouse leaves the tool tip window.
 *
 * As of now this works with jquery-1.8.3 and jquery-ui-1.9.2
 */

(function($) {
    function closeTip( tip, uid )
    {
  var d = tip.data('pTooltip')

  // Do nothing if the calling uid and tip.uid don't match.
  // Don't close if the mouse has entered the tooltip. (In
  // this case the tip will be closed by a mouseleave event)
  if( uid === d.uid && !d.mouseEntered )
      tip.hide();
    }
  
    $.fn.pTooltip = function( args )
    {
  // this: jQuery object with a list of items for which the tool tip is required.
  var options = {
      tipCloseDelay: 500, /* ms after which we attempt to close the tip */

      findToolTip: function(t) {
    /*
     * Should return a jQuery object containining the tool tip for
     * the jQuery object t. (Default: title attribute to each
     * object contains the ID to the tool tip element.)
     */
    return $( '#' + t.attr('title') );
      },

      tipPosition: function(t) {
    /*
     * Returns the position at which the tip of "t" should be placed. 
     */
    return { my: 'center top+15', at: 'center bottom', of: t,
          collision: 'fit flip' };
      }
  };
  $.extend( options, args );

  return this.each( function()
  {
      // this is a DOM element. ID of tooltip element is in the title attribute
      var t = $(this);
      var tip = options.findToolTip(t);

      // Debug check
      if( tip.length === 0 )
    throw( 'No element with ID ' + t.attr('title') );

      // Remove title attribute from element
      t.removeAttr( 'title' );

      // Show tooltip on mouse over.
      t.mouseover( function()
    {
        // Hide all visible tips
        $(':visible:data(pTooltip)').hide();

        // Set UID to 0 here to cancel any closeTip events that
        // might fire from other elements that showed the same tip.
        var d = $.extend( tip.data('pTooltip'),
          { mouseEntered: false, uid: 0 } );
        tip.data( 'pTooltip', d );

        tip.show().position( options.tipPosition(t) );
    });

      // Wait a little, and then call the close function.
      t.mouseleave( function()
    {
        // Use time (in miliseconds) as a UID
        var uid = $.now();
        var d = $.extend( tip.data('pTooltip'), { uid: uid} );
        tip.data( 'pTooltip', d );

        setTimeout( function() { closeTip( tip, uid ); },
      options.tipCloseDelay );
    });

      // Set pTooltip.mouseEntered when the mouse enters.
      tip.mouseover( function()
        {
      var d = $.extend( tip.data('pTooltip'), { mouseEntered: true } );
      tip.data( 'pTooltip', d );
        } );

      // Close the tool tip when the mouse leaves
      tip.mouseleave( function() { tip.hide(); } );

      // Style the tip
      tip.hide().addClass( 'ui-tooltip ui-widget ui-corner-all ui-widget-content' );
      
  } );
    }
})(jQuery);
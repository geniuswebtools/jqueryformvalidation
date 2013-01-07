/**
 * GeniusWebTools.com jQuery Form Valdiation
 *
 * @version 2.1
 * @author Marion Dorsett <marion@geniuswebtools.com>
 *
 * TODO Write a description
 *
 * Expects the following CSS classes:
 * .required = Validates
 * .match-{ID} = Matches this field to a similar field of #ID
 *
 * Validation is done based on field types:
 * text = Must have not be empty
 * email = Must be an email
 * url = Must be a URL (http(s))
 * radio = Required checked, on one radio button with in a named group.  Only
 *         one radio button should set the required class
 * select = Selected option must not be empty (Atleast one option must be empty.)
 * number = Must be a number (min and max attributes will set range)
 *
 * The fields title attribute will be use by default to inform the user which
 * field has the error. If the ID attribute is used instead underscores will be
 * replaced with spaces.
 *
 * If the defined field attribute is not
 */
(function($){
  $.fn.gwtFormValidate = function(options){
    var AUDIT = {
      debug : false,
      urlRegExp : /(https?)\:\/{2}.{1,}\.{1}.{2,}/i,
      emailRegExp : /.{1,}@{1}.{1,}\.{1}.{2,}/gi,
      log : function(str)
      {
        if(this.debug === false) {
          return;
        }
        try {
          console.log(str);
        }
        catch(e) { /* no console */ }
      },
      label : function(obj)
      {
        var label = obj.attr(args.fieldLabel);
        if(!label){
          label = obj.attr('id');
        }
        if(!label){
          label = obj.attr('placeholder');
        }
        if(!label){
          label = obj.attr('name');
        }
        if(!label){
          label = 'Unknown Field';
        }
        return label.replace(/_/gi,' ');
      },
      value : function(val) {
        return (val) ? true : false;
      },
      email : function(val) {
        return (val.search(this.emailRegExp) != -1) ? true : false;
      },
      match : function(val1, val2) {
        return (val1 == val2) ? true : false;
      },
      url : function(val) {
        return (val.search(this.urlRegExp) != -1) ? true : false;
      }
    };

    var that = this; // jQuery object
    var args = $.extend({
      log : false,
      check : 'validate',
      require : 'required',
      match : 'match',
      fieldLabel : 'title',
      preventDefault : false,
      callBack : false,
      urlRegExp : false,
      emailRegExp : false
    }, options);

    var errorTemplateBet = ' between __MIN__ and __MAX__';
    var errorTemplateMin = ' greater than or equal to __MIN__';
    var errorTemplateMax = ' less than or equal to __MAX__';
    var errorTemplateStep = ' an interval of __STEP__';

    $(that.selector).bind('submit', function(e) {
      if(args.log === true) {
        AUDIT.debug = true;
      }
      AUDIT.log('Validating Form ' + that.selector);

      if(args.preventDefault === true)
      {
        AUDIT.log('\tPrevent default is active.');
        e.preventDefault();
      }

      if(args.urlRegExp !== false) {
        AUDIT.urlRegExp = args.urlRegExp;
      }
      if(args.emailRegExp !== false) {
        AUDIT.emailRegExp = args.emailRegExp;
      }

      var Errors = '';
      var parentSelector = that.selector;
      var requireSelector = parentSelector + ' .' + args.require;
      var checkSelector = parentSelector + ' .' + args.check;

      AUDIT.log('\tFinding Fields for selectors:\n\t\t' + requireSelector + '\n\t\t' + checkSelector);
      $(requireSelector + ',' + checkSelector).each(function(i) {
        var label = AUDIT.label($(this));
        var name = $(this).attr('name') || false;
        var type = $(this).attr('type') || false;
        var classes = $(this).attr('class');
        var val = $.trim($(this).val());
        var isValid = true;
        var isRequired = $(this).hasClass(args.require);
        var isEmail = (type == 'email') ? true : false;
        var isURL = (type == 'url') ? true : false;
        var matchPattern = new RegExp(args.match + '-', 'gi');
        var isMatch = ((classes.search(matchPattern) != -1)) ? true : false;
        var isNum = (type == 'number') ? true : false;
        var isRange = (type == 'range') ? true : false;

        if(type === false) {
          type = $(this).context.nodeName.toString().toLowerCase();
        }

        var verbose = '\tFound Field: ' + label + '\n';
        verbose += '\t\tName: ' + name + '\n';
        verbose += '\t\tType: ' + type + '\n';
        verbose += '\t\tIs Required: ' + isRequired + '\n';
        verbose += '\t\tIs Email: ' + isEmail + '\n';
        verbose += '\t\tIs URL: ' + isURL + '\n';
        verbose += '\t\tIs Match: ' + isMatch + '\n';
        verbose += '\t\tIs Number: ' + isNum + '\n';
        verbose += '\t\tIs Range: ' + isRange + '\n';
        AUDIT.log(verbose);

        // Start field validation
        if(isRequired === true) {
          switch(type)
          {
            case 'checkbox':
            case 'radio':
              var isChecked = $('input[type="' + type + '"][name="' + name + '"]:checked').length;
              if(isChecked == 0) {
                isValid = false;
              }
              break;
            default:
              isValid = AUDIT.value(val);
              break;
          }

          if(isValid === false) {
            Errors += label+' is required.\n';
          }
        }

        // If there's no value, and it's not required there's nothing to check.
        if(val)
        {
          if(isEmail === true) {
            if(AUDIT.email(val) === false) {
              Errors += label+' must be an email address.\n';
            }
          }

          if(isMatch === true) {
            var findMatch = new RegExp(args.match + '-[a-z0-9_]{1,}[^\s]?','gi');
            var matches = classes.match(findMatch);
            var label2 = matches[0].toString().replace(args.match + '-', '');
            var val2  = $('#' + label2).val();
            if(AUDIT.match(val, val2) === false) {
              Errors += label+' doesn\'t match '+label2.replace(/_/gi,' ')+'.\n';
            }
          }

          if(isURL === true) {
            if(AUDIT.url(val) === false) {
              Errors += label+' must be a URL.\n';
            }
          }
          if( (isNum === true) || (isRange === true)) {
            var num = parseFloat(val, 10);

            if(isNaN(num)) {
              Errors += label+' must be a number.\n';
            }
            else {
              var hasMin = $(this).attr('min') || false;
              var hasMax = $(this).attr('max') || false;
              var hasStep = $(this).attr('step') || false;
              var betError = false;
              var minError = false;
              var maxError = false;
              var stepError = false;
              var useTemplate = '';

              if( (hasMin) && (num < hasMin) ) {
                minError = true;
              }
              if( (hasMax) && (num > hasMax) ) {
                maxError = true;
              }
              if( ((hasMin) && (hasMax)) && ((minError) || (maxError)) ){
                betError = true;
              }
              if(hasStep){
                stepUp = parseFloat((num/hasStep), 10);
                if(stepUp.toString().indexOf('.') != -1) {
                  stepError = true;
                }
              }

              if(betError === true) {
                useTemplate = errorTemplateBet;
              }
              else if(maxError === true) {
                useTemplate = errorTemplateMax;
              }
              else if(minError === true) {
                useTemplate = errorTemplateMin;
              }

              if(stepError === true) {
                if( (minError) || (maxError) ) {
                  useTemplate += ' and';
                }
                useTemplate += errorTemplateStep;
              }

              if( (minError) || (maxError) || (stepError) ) {
                Errors += label+' must be'+useTemplate.replace(/__MAX__/, hasMax).replace(/__MIN__/, hasMin).replace(/__STEP__/, hasStep)+'.\n';
              }
            }
          }
        }
      });

      if(Errors != '')
      {
        AUDIT.log('Errors were found:\n' + Errors);
        var isUI = false;
        try {
          isUI = $.ui.version
        }
        catch(e) {
          isUI = false;
        }
        if(isUI !== false) {
          var ErrorMsg  = '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
              ErrorMsg += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
              ErrorMsg += '<strong>Alert!</strong> Please correct the following errors to continue.</p></div>';
              ErrorMsg += '<p>' + Errors.toString().replace(/\n/g, '<br />') + '</p>';
          var dialogId = 'gwtFormValidateDialogError' + parentSelector.toString().replace(/[^a-z-0-9_]/gi,'');
          var hasDialogID = ($('#' + dialogId).length == 1) ? true : false;
          if(hasDialogID === false) {
            AUDIT.log('Dialog Modal ID Created: ' + dialogId);
            $('body').append('<div id="' + dialogId + '" title="Form Errors">' + ErrorMsg + '</div>')
          }
          else {
            $('#' + dialogId).html(ErrorMsg);
          }

          $('#' + dialogId).dialog({
            modal: true
          });
        }
        else {
          AUDIT.log('jQuery UI not found, so alert() will be used.');
          alert(Errors);
        }

        return false;
      }

      AUDIT.log('No Errors!');
      AUDIT.log(typeof args.callBack);
      if(typeof args.callBack === 'function') { args.callBack(); }
      else if(typeof window[args.callBack] === 'function') { window[args.callBack]; }

      return true;
    });

    return this;
  };
})(jQuery);
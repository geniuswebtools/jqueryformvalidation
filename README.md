jQuery Form Validation
======================
This is a very simplified HTML form validation plugin for jQuery.  When the form
is submitted, the plugin will can for fields you want to require, or validate
the value is correct, like email addresses, urls and numbers.

If you're using the jQuery UI, a dialog modal will be used to display the errors,
if any exist, otherwise an alert() will be used.

### Example Form
<span><form method="post" action="" id="myForm">
Text Field <input type="text" name="field_1" class="required" title="Text Field" placeholder="you have to fill me in!" />
Email Field <input type="email" name="field_2" class="required" title="Email_Address" id="Email_Address" placeholder="your email is required" />
Type Email <input type="email" name="field_3" class="match match-Email_Address" title="Verify_Email_Address" placeholder="your email is required" />
Your favorite color:
<label>Red <input type="radio" name="radio_1" class="required" id="Choose_Your_Color" value="#ff0000" /></label>
<label>Green <input type="radio" name="radio_1" value="#00ff00" /></label>
<label>Blue <input type="radio" name="radio_1"  value="#0000ff" /></label>
<form>
<script type="text/javascript">
// <![CDATA
jQuery(function($) {
 $('#myForm').gwtFormValidate();
});
// ]]>
</script></span>
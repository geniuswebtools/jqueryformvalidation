jQuery Form Validation
======================
This is a very simplified HTML form validation plugin for jQuery.  When the form
is submitted, the plugin will can for fields you want to require, or validate
the value is correct, like email addresses, urls and numbers.

If you're using the jQuery UI, a dialog modal will be used to display the errors,
if any exist, otherwise an alert() will be used.

### Features
* Required fields: including select, radio and checkboxes
* Match the values of two fields
* Check the accuracy of field values like: email, url, numbers and ranges.
* Invoke a custom callback
* Error classed applied to fields that failed validation

### Example Form
<pre><code>&lt;form method="post" action="" id="myForm">
  Text Field &lt;input type="text" name="field_1" class="required" title="Text Field" placeholder="you have to fill me in!" />
  Email Field &lt;input type="email" name="field_2" class="required" title="Email_Address" id="Email_Address" placeholder="your email is required" />
  Type Email &lt;input type="email" name="field_3" class="match match-Email_Address" title="Verify_Email_Address" placeholder="your email is required" />
  Your favorite color:
  <label>Red &lt;input type="radio" name="radio_1" class="required" id="Choose_Your_Color" value="#ff0000" /></label>
  <label>Green &lt;input type="radio" name="radio_1" value="#00ff00" /></label>
  <label>Blue &lt;input type="radio" name="radio_1"  value="#0000ff" /></label>
  <form>
  &lt;script type="text/javascript">
  // &lt;![CDATA
  jQuery(function($) {
   $('#myForm').gwtFormValidate();
  });
  // ]]>
  &lt;/script>
</code></pre>


### What you need to know
There are four classes used to help with form validation.
* .required
* .validate
* .match
* .match-ID
* .error

Fields should have a title attribute that provides a description so the user knows
what fields failed validation.  If a title is not defined, the plugin will use the
first alternative that it finds: id, placeholder, name or defaults to Unknown.

Some fields may not be required, but you still want to ensure data integrity if
the field has a value.  Simply add the <code>validate</code> class to those fields,
and they'll be matched against their field types.

If you want to match the value of two fields to make sure they match, give one
field an id.  Assign the second field with the two classes <code>match match-ID</code>
The <code>ID</code> in <code>match-ID</code> should be the ID you assigned to the
first field. See the *form.html* for a clear example.

If a field fails validation, the class <code>error</code> is applied to the field.
If the field passes validation on the following submission attempt, the field
is removed.

### Validating Field Types
If a field is required a simple check to see if it has a value is performed. If
a value is found more specific validations are searched for.

Some browsers don't support the HTML5 field types, but the validation still works
even if the fields don't look the same.  Unsupported HTML5 field types will be
rendered as text fields.

Email and URL fields will be validated by supported browsers, and against a loose
regular expression before it passes validation.  The RegExp can be overridden for
both fields you need tighter or more loose validation.

Numbers and ranges work exactly the same, supported browsers will render them
differently, but browsers that don't support them.  These fields will be validated
as a number.  If the <code>min</code>, <code>max</code> and <code>step</code>
attributes are defined they'll be validated against those values as well.

To validate a radio group to make sure that one is checked before the form is
submitted, only one of the fields needs the <code>required</code> class.

Check boxes can be validated the same way as radio buttons, provided that you name
them as an array <code>name="sample[]"</code>.  More than one box can be checked,
but at least one must be checked for the form to submit.

### Minimum and Maximum
Adding the min and max attributes to string input fields will check their lengths
to make sure they're at least as long as the min value, or as not longer then the
max value.

### Submission and Callbacks
If any errors are found, a message will be returned, and the form submission will
be stopped.  After the validation passes, the form will continue the submission.

If nothing is configured it will continue with it's default process, and make it's
call to action.  If you want, you can add or override the call to action with a
callback method.
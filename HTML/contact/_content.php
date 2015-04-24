<div id="page-header">
    <div class="container">
        <h1>Contact</h1>
        <div class="col-sm-4 pull-right">
            <a class="connect ico-linkedin" style="padding: 0; text-align: right;" href="http://linkedin.com/in/azkai">LinkedIn</a>
        </div>
        <!-- ICON BLOCK : end -->
    </div><!-- end header container -->
</div>
<!-- END: page header -->

<!-- FORM SECTION : begin -->
<section>
    <div class="container">

        <h2>Let's Chat! &nbsp;<span class="fa-smile-o"></span></h2>

        <!-- CONTACT FORM : begin -->
        <form id="contact-form" class="default-form m-ajax-form" action="/ajax/contact-form.php" method="post" >
            <input type="hidden" name="contact-form">

            <!-- FORM VALIDATION ERROR MESSAGE : begin -->
            <p class="c-alert-message m-warning m-validation-error" style="display: none;"><i class="fa fa-exclamation-circle"></i> I think you missed a field! Please fill in all required (*) fields.</p>
            <!-- FORM VALIDATION ERROR MESSAGE : end -->

            <!-- SENDING REQUEST ERROR MESSAGE : begin -->
            <p class="c-alert-message m-warning m-request-error" style="display: none;"><i class="fa fa-exclamation-circle"></i> Phail whale... Our server blew up. Try again in 10 minutes or contact me on LinkedIn.</p>
            <!-- SENDING REQUEST ERROR MESSAGE : end -->

            <div class="row">
                <div class="col-sm-4">

                    <!-- NAME FIELD : begin -->
                    <div class="form-field">
                        <label for="contact-name">Your Name <span>*</span></label>
                        <input id="contact-name" name="contact-name" class="m-required" placeholder="Nice to meet you!">
                    </div>
                    <!-- NAME FIELD : end -->

                    <!-- EMAIL FIELD : begin -->
                    <div class="form-field">
                        <label for="contact-email">Your Email Address <span>*</span></label>
                        <input id="contact-email" name="contact-email" class="m-required m-email" placeholder="How can I reach you?">
                    </div>
                    <p style="display: none;">
                        <label for="contact-email-hp">Re Email Address</label>
                        <input id="contact-email-hp" name="contact-email-hp">
                    </p>
                    <!-- EMAIL FIELD : end -->

                    <!-- PHONE FIELD : begin -->
                    <div class="form-field">
                        <label for="contact-phone">Your Phone Number</label>
                        <input id="contact-phone" name="contact-phone" placeholder="Should I call you instead?">
                    </div>
                    <!-- PHONE FIELD : end -->

                </div>
                <div class="col-sm-8">

                    <!-- MESSAGE FIELD : begin -->
                    <div class="form-field">
                        <label for="contact-message">Message <span>*</span></label>
                        <textarea id="contact-message" name="contact-message" class="m-required" placeholder="What's up? How can I help you?"></textarea>
                    </div>
                    <!-- MESSAGE FIELD : end -->

                    <!-- SUBMIT BUTTON : begin -->
                    <div class="form-field">
                        <button class="submit-btn c-button" type="submit" data-label="Send Message" data-loading-label="Sending...">Send Message</button>
                    </div>
                    <!-- SUBMIT BUTTON : end -->

                </div>
            </div>

        </form>
        <!-- CONTACT FORM : end -->

    </div>
</section>
<!-- FORM SECTION : end -->
<? include($_SERVER[DOCUMENT_ROOT] .'/library/includes/getURL.php'); ?>
<header id="header" class="
<?php 
	if($pageVar=="http://azkai.io/" || $pageVar=="http://azkai.io/index.php") { echo "m-large m-enable-fixed m-fixed-bg"; }
	elseif($pageVar=="http://stage.azkai.io/" || $pageVar=="http://stage.azkai.io/index.php") { echo "m-large m-enable-fixed m-fixed-bg"; }
	else { echo "m-standard m-enable-fixed m-fixed-bg"; } ?>
	">
	<div class="header-inner">
		<div class="container">

			<!-- HEADER CONTENT : begin -->
			<div class="header-content">

				<!-- HEADER BRANDING : begin -->
				<div class="header-branding">
					<div class="header-branding-inner">
						<a href="/">
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 128.2 150" version="1.1" y="0px" x="0px" enable-background="new 0 0 128.2 150">
								<g class="logo">
									<path d="m108.7 40.2c-2.6-7.8-6.8-14.9-12.1-20.9l-0.3 0.4c-0.2-0.2-0.3-0.1-0.3-0.1v0.2l-22.7 32.5c-2.7-0.6-5.5-0.9-8.4-0.9s-5.7 0.4-8.4 1l-22.8-32.7v-0.2c0 0.1-0.2 0.1-0.3 0.2l-0.3-0.5c-9.6 10.9-15.4 25.1-15.4 40.8v2c-0.1 2 0 4.1 0.1 6.3 0.9 17.4 3.4 28.9 8.5 38.1 6.7 15.3 23.6 26 38.4 31.4 1.4-0.4 2.9-0.9 4.5-1.6-4.9-9.4-7.7-20.1-7.7-31.5 0-30.1 19.8-55.7 47.2-64.5zm-55.1 74.9c-4 1.1-8.5 0.3-11.9-2.6-4-3.4-5.4-8.7-4.1-13.4 4-1.1 8.5-0.3 11.9 2.6 4 3.3 5.4 8.6 4.1 13.4z"/>
									<path d="m88.1 112.5c4-3.4 5.4-8.7 4.1-13.4-4-1.1-8.5-0.3-11.9 2.6-4 3.4-5.4 8.7-4.1 13.4 3.9 1.1 8.4 0.3 11.9-2.6z"/>
								</g>
							</svg>
						</a>
					</div>
				</div>
				<!-- HEADER BRANDING : end -->

				<!-- HEADER MENU : begin -->
				<nav class="header-menu">
					<ul>
<!-- 						<li class="<?php if($pageVar=="http://stage.azkai.io/" || $pageVar=="http://stage.azkai.io/index.php"){ echo "m-active"; } ?>"><a href="/">Home</a></li>
						 -->						<li class="<?php if(strstr($pageVar,'about')){ echo "m-active"; } ?>"><a href="/about" title="Kai ByRoade &mdash; AzKai Art">The Artist</a></li>
						<li class="<?php if(strstr($pageVar,'brand')){ echo "m-active"; } ?>"><a href="/brand" title="AzKai Art &mdash; Pixel Art, UX Design &amp; Front-End Development">The Brand</a></li>
						<!-- <li><a href="index.html">Blog</a></li> -->
						<li class="<?php if(strstr($pageVar,'portfolio')){ echo "m-active"; } ?>"><a href="/portfolio" title="UX Design, Web Design &amp; Front-End Development from AzKai's Portfolio">The Pixels</a></li>
						<li class="<?php if(strstr($pageVar,'contact')){ echo "m-active"; } ?>"><a href="/contact" title="Connect with AzKai (Kai ByRoade)">Let's Chat!</a></li>
						
					</ul>
				</nav>
				<!-- HEADER MENU : end -->

			</div>
			<!-- HEADER CONTENT : end -->

			<!-- MAIN SIDEBAR TOGGLE : begin -->
			<button class="main-sidebar-toggle" type="button"  style="display: none"><i class="fa fa-bars"></i></button>
			<!-- MAIN SIDEBAR TOGGLE : end -->

		</div>
	</div>
</header>
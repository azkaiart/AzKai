				</div><!-- page-content : end -->
			</div>
			<!-- CORE : end -->

			<? include($_SERVER[DOCUMENT_ROOT] . '/library/includes/bottom-panel.php'); ?>

			<? include($_SERVER[DOCUMENT_ROOT] . '/library/includes/footer.php'); ?>

		</main>

		<? include($_SERVER[DOCUMENT_ROOT] . '/library/includes/scripts.js'); ?>

		<!-- Google Analytics -->
		<? include($_SERVER[DOCUMENT_ROOT] . '/library/js/analytics.js'); ?>

		<!-- If Portfolio, add our scripts. -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.2/handlebars.min.js"></script>
		<?php if(strstr($pageVar,'portfolio')){ include($_SERVER[DOCUMENT_ROOT] . '/library/js/behance.js'); } ?>

	</body>
</html>
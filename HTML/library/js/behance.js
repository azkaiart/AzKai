<script>
$(document).ready(function() {

	var apiKey  = 'eJx7xKmsoZWkth889QO9k16iNNypXnuV';
	var userID  = 'azkai';

	(function() {
		var perPage = 12;
		var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?callback=?&api_key=' + apiKey + '&per_page=' + perPage;
		var behanceFields = 'https://api.behance.net/v2/fields?' + apiKey;

		function setPortfolioTemplate() {
			var projectData = JSON.parse(sessionStorage.getItem('behanceProject')),
				getTemplate = $('#portfolio-template').html(),
				template    = Handlebars.compile(getTemplate),
				result      = template(projectData);
			$('#portfolio').html(result);
		};

		if(sessionStorage.getItem('behanceProject')) {
			setPortfolioTemplate();
		} else {
			$.getJSON(behanceProjectAPI, behanceFields, function(project) {
				var data = JSON.stringify(project);
				sessionStorage.setItem('behanceProject', data);
				setPortfolioTemplate();
			});
		};
	})();
});
</script>

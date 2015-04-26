<script>
	$(document).ready(function() {

		var apiKey  = 'eJx7xKmsoZWkth889QO9k16iNNypXnuV';
		var userID  = 'azkai';

/*		(function() {
			var behanceUserAPI = 'http://www.behance.net/v2/users/'+ userID +'?callback=?&api_key='+ apiKey;

			function setUserTemplate() {
				var userData     = JSON.parse(sessionStorage.getItem('behanceUser')),
					getTemplate = $('#profile-template').html(),
					template     = Handlebars.compile(getTemplate),
					result       = template(userData);
			    $('#header').html(result);
			};

			if(sessionStorage.getItem('behanceUser')) {
				setUserTemplate();
			} else {
				$.getJSON(behanceUserAPI, function(user) {
					var data = JSON.stringify(user);
					sessionStorage.setItem('behanceUser', data);
					setUserTemplate();
				});
			};
		})();*/

		(function() {
			var perPage = 12;
			var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?callback=?&api_key=' + apiKey + '&per_page=' + perPage;

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
				$.getJSON(behanceProjectAPI, function(project) {
					var data = JSON.stringify(project);
					sessionStorage.setItem('behanceProject', data);
					setPortfolioTemplate();
				});
			};
		})();

		$('#portfolio').on('click', '.portfolio-cover', function() {
			var $this =	$(this),
				projectID = $this.data('project-id'),
				beProjectContentAPI = 'http://www.behance.net/v2/projects/'+ projectID +'?callback=?&api_key=' + apiKey,
				keyName = 'behanceProjectImages-' + projectID;
			
			function showGallery(dataSource) {	
				$this.magnificPopup({
					items: dataSource,
					gallery: {
						enabled: true
					},
					type: 'image',
					mainClass: 'animated',
					removalDelay: 350
				}).magnificPopup('open');
			};

			if(localStorage.getItem(keyName)) {
				var srcItems = JSON.parse(localStorage.getItem(keyName));
				showGallery(srcItems);
			} else {
				$.getJSON(beProjectContentAPI, function(projectContent) {
					var src = [];
					$.each(projectContent.project.modules, function(index, mod) {
						if(mod.src != undefined) {
							src.push({ src: mod.src });	
						}
					});
					showGallery(src);
					var data = JSON.stringify(src);
					localStorage.setItem(keyName, data);
				});
			};
		});
	});
	</script>

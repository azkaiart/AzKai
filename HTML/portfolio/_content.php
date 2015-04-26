<!-- PAGE HEADER : begin -->
<div id="page-header">
    <div class="container">
        <h1>AzKai Art</h1>
    </div>
</div>
<!-- PAGE HEADER : end -->

    <!-- PORTFOLIO LIST : begin -->
    <div class="portfolio-list">

        <!-- GALLERY : begin -->
        <div class="c-gallery" data-layout="fitRows">

            <!-- ITEM LIST : begin -->
            <div id="portfolio">
                
                <script id="portfolio-template" type="text/x-handlebars-template">
                    <ul class="item-list">
                        {{#each projects}}
                            <li class="item m-has-overlay m-animated">
                                <a data-project-id="{{this.id}}" href="/project/index.php?id={{this.id}}" class="item-image"><img src="{{this.covers.[404]}}" alt="{{this.name}} by {{this.[owners].[0].username}}"></a>
                                <div class="item-info">
                                    <h4><a href="portfolio-detail-slider-top.html">{{this.name}}</a></h4>
                                    <p>{{#each this.fields}}{{this}},&nbsp;{{/each}}</p>
                                </div>
                            </li>
                        {{/each}}
                    </ul>
                </script>
            </div>
            <!-- ITEM LIST : end -->

        </div>
        <!-- GALLERY : end -->
    </div>
    <!-- PORTFOLIO LIST : end -->


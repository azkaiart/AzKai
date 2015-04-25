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

            <!-- GALLERY TOOLS : begin -->
            <!-- <div class="gallery-tools">
                <div class="container">
                    <div class="clearfix">
            
                        GALLERY FILTER : begin
                        <ul class="gallery-filter">
                            <li><button class="m-active" type="button" data-filter="*">all</button></li>
                            <li><button type="button" data-filter=".cat-webdesign">web design</button></li>
                            <li><button type="button" data-filter=".cat-pixelart">pixel art</button></li>
                            <li><button type="button" data-filter=".cat-branding">branding</button></li>
                        </ul>
                        GALLERY FILTER : end
            
                    </div>
                </div>
            </div> -->
            <!-- GALLERY TOOLS : end -->

            <!-- ITEM LIST : begin -->
            <div id="portfolio">
                
                <script id="portfolio-template" type="text/x-handlebars-template">
                    <ul class="item-list">
                        {{#each projects}}
                            <li class="item m-has-overlay m-animated">
                                <a data-project-id="{{this.id}}" href="project.php?id={{this.id}}" class="item-image"><img src="{{this.covers.[404]}}" alt="{{this.name}} by "></a>
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

            <!-- PAGINATION : begin -->
            <!-- <div class="c-pagination">
                <div class="container">
                    <ul>
                        <li class="pagination-prev"><a href="#" class="c-button m-outline"><i class="fa fa-chevron-left"></i></a></li>
                        <li><a href="#" class="c-button m-outline">1</a></li>
                        <li class="m-active"><a href="#" class="c-button m-outline">2</a></li>
                        <li><a href="#" class="c-button m-outline">3</a></li>
                        <li class="pagination-next"><a href="#" class="c-button m-outline"><i class="fa fa-chevron-right"></i></a></li>
                    </ul>
                </div>
            </div> -->
            <!-- PAGINATION : end -->

        </div>
        <!-- GALLERY : end -->
    </div>
    <!-- PORTFOLIO LIST : end -->


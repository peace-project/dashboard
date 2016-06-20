this["Peace"] = this["Peace"] || {};
this["Peace"]["templates"] = this["Peace"]["templates"] || {};
this["Peace"]["templates"]["additionalData_table"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "                <td class=\"popup-tb-title\">"
    + this.escapeExpression(((helper = (helper = helpers.server || (depth0 != null ? depth0.server : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"server","hash":{},"data":data}) : helper)))
    + "</td>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.configuration : stack1), depth0))
    + "</td>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.cpuCores : stack1), depth0))
    + "</td>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.cpuPower : stack1), depth0))
    + "</td>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.dockerContainer : stack1), depth0))
    + "</td>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.dockerEngine : stack1), depth0))
    + "</td>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.hostOperatingSystem : stack1), depth0))
    + "</td>\r\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.network : stack1), depth0))
    + "</td>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.purpose : stack1), depth0))
    + "</td>\r\n";
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <td class=\"popup-tb-val\"> "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.ram : stack1), depth0))
    + "</td>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h3 class=\"additionalData-table-title\">Additional Data</h3>\r\n<table class=\"additionalData-table\" width=\"100%\">\r\n    <tbody>\r\n\r\n            <tr>\r\n                <th>Environment</th>\r\n            </tr>\r\n\r\n            <tr>\r\n                <td></td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            <tr>\r\n                <td class=\"popup-tb-title\"> configuration</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> cpuCores</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> cpuPower</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> dockerContainer</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> dockerEngine</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> hostOperatingSystem</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> network</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n                <td class=\"popup-tb-title\"> purpose</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n            <tr>\r\n\r\n                <td class=\"popup-tb-title\"> ram</td>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.test : depth0),{"name":"each","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tr>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    </tbody>\r\n\r\n\r\n\r\n</table>";
},"useData":true});
this["Peace"]["templates"]["conformance_table"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "             <th class=\"text-center engine-col-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" colspan=\""
    + alias2(this.lambda(((stack1 = (depth0 != null ? depth0.instances : depth0)) != null ? stack1.length : stack1), depth0))
    + "\"> "
    + alias2((helpers.capitalize || (depth0 && depth0.capitalize) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"capitalize","hash":{},"data":data}))
    + "</th>\n";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.escapeExpression, alias2=helpers.helperMissing, alias3="function";

  return "                    <th class=\"cell-version engine-col-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                         <a role=\"button\" tabindex=\"0\" data-engine-info=\""
    + alias1(((helper = (helper = helpers.indexEngine || (depth0 != null ? depth0.indexEngine : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"indexEngine","hash":{},"data":data}) : helper)))
    + "\" class=\"engine-info\" >\n                     "
    + alias1(((helper = (helper = helpers.versionLong || (depth0 != null ? depth0.versionLong : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"versionLong","hash":{},"data":data}) : helper)))
    + "</a></th>\n";
},"6":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                    <td>"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].summaryRow : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n";
},"8":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda(depth0, depth0))
    + " ";
},"10":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <tr "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " >\n\n                    <td "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n                    </td>\n                    <td class=\"construct-col\">\n                       <div> \n                           <span class=\"entypo-right-open\"></span>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + " \n                            <a title=\""
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" class=\"construct-info\">\n                                <span class=\"entypo-info\"></span>\n                            </a>\n                            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.moreThanTwoFeatures : depth0),{"name":"if","hash":{},"fn":this.program(17, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " \n                        </div>\n                    </td>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depths[1] != null ? depths[1].engines : depths[1]),{"name":"each","hash":{},"fn":this.program(19, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(23, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"11":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.escapeExpression;

  return " class=\"collapse-parent-row\" data-toggle=\"collapse\" data-target=\".row-feat-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" ";
},"13":function(depth0,helpers,partials,data) {
    return "class=\"border-top\"";
},"15":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                            <div>\n                            "
    + alias3(((helper = (helper = helpers.groupName || (depth0 != null ? depth0.groupName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"groupName","hash":{},"data":data}) : helper)))
    + " \n                            <a title=\""
    + alias3(((helper = (helper = helpers.groupDesc || (depth0 != null ? depth0.groupDesc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"groupDesc","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" class=\"group-info\">\n                            <span class=\"entypo-info\"></span></a>\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return " <span class=\"info-badge\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1), depth0))
    + "</span> ";
},"19":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(20, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"20":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                 <td class=\"result\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].supportStatus : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(21, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                </td>\n";
},"21":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <span class=\"support-"
    + alias3(((helper = (helper = helpers.fullSupport || (depth0 != null ? depth0.fullSupport : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"fullSupport","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"html","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"23":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "                    <!-- feature -->\n                    <tr class=\"collapse-header collapse row-feat-title row-feat-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n                        <td></td>\n                        <td class=\"collapse-title-cell\" "
    + ((stack1 = helpers.unless.call(depth0,(depths[1] != null ? depths[1].moreThanTwoFeatures : depths[1]),{"name":"unless","hash":{},"fn":this.program(24, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "><div class=\"collapse-title-border\">Features</div> </td>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depths[1] != null ? depths[1].moreThanTwoFeatures : depths[1]),{"name":"if","hash":{},"fn":this.program(26, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </tr>  \n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.features : depth0),{"name":"each","hash":{},"fn":this.program(32, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                     <!-- feature end-->\n\n\n";
},"24":function(depth0,helpers,partials,data,blockParams,depths) {
    return " colspan=\""
    + this.escapeExpression(this.lambda((depths[3] != null ? depths[3].featureTitleColspan : depths[3]), depth0))
    + "\"";
},"26":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(27, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"27":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(28, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"28":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                     <td class=\"collapse-header-cell\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[4] != null ? depths[4].supportStatus : depths[4]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(29, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </td>\n";
},"29":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.engineID : depth0),{"name":"if","hash":{},"fn":this.program(30, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"30":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "                                            "
    + alias1(((helper = (helper = helpers.supportedFeature || (depth0 != null ? depth0.supportedFeature : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"supportedFeature","hash":{},"data":data}) : helper)))
    + "/"
    + alias1(this.lambda(((stack1 = (depths[5] != null ? depths[5].features : depths[5])) != null ? stack1.length : stack1), depth0))
    + "\n";
},"32":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "\n                    <tr class=\"collapse-row collapse row-feat-"
    + alias2(alias1((this.data(data, 2) && this.data(data, 2).index), depth0))
    + alias2(alias1((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                        <td class=\"collapse-feature-first-cell\"></td>\n                        <td class=\"collapse-feature-cell\">\n                            <div class=\"collapse-cell-border\">\n                                <p>"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n                                <a role=\"button\" tabindex=\"0\" data-feature-info=\""
    + alias2(((helper = (helper = helpers.featureIndex || (depth0 != null ? depth0.featureIndex : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"featureIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"info-feature\">\n                                <span class=\"entypo-help-circled\"></span>\n                                </a></p>\n                            </div>\n                        </td>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(33, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </tr>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.lastFeature : depth0),{"name":"if","hash":{},"fn":this.program(38, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"33":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(34, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"34":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                <td class=\"result\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].results : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(35, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                </td>\n";
},"35":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.html : depth0),{"name":"if","hash":{},"fn":this.program(36, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"36":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "                                        <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[4] != null ? depths[4].featureIndex : depths[4]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[2] != null ? depths[2].id : depths[2]), depth0))
    + "\"  class=\"info-engine-test\">\n                                        <span class=\""
    + alias2(((helper = (helper = helpers.html_class || (depth0 != null ? depth0.html_class : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html_class","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html","hash":{},"data":data}) : helper)))
    + "</span>\n                                        </a>\n";
},"38":function(depth0,helpers,partials,data,blockParams,depths) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <tr class=\"feature-end collapse row-feat-"
    + alias2(alias1((this.data(data, 2) && this.data(data, 2).index), depth0))
    + alias2(alias1((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                        <td class=\"collapse-end-first-cell\"></td>\n                        <td class=\"collapse-end-cell\" colspan=\""
    + alias2(alias1((depths[4] != null ? depths[4].featureTitleColspan : depths[4]), depth0))
    + "\">\n                            <div class=\"collapse-end-border\"></div> \n                        </td>\n                    </tr> \n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "\n<table class=\"cap-table table\">\n    <thead>\n        <tr>\n            <th rowspan=\"3\" class=\"group-col th-last-child\">Group</th>\n            <th rowspan=\"3\" class=\"construct-col th-last-child\">Construct</th>\n            <th class=\"text-center engine-col\" colspan=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engines : depth0)) != null ? stack1.count : stack1), depth0))
    + "\">Engine</th> \n        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n\n    </thead>\n    <tbody>\n        <tr>\n            <td class=\"border-top\">∑</td>\n            <td class=\"construct-col\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.tests : depth0)) != null ? stack1.length : stack1), depth0))
    + "</td>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tests : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tbody>   \n\n</table>\n";
},"useData":true,"useDepths":true});
this["Peace"]["templates"]["engine_info"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<table class=\"table engine-info-tb\" width=\"100%\">\n    <tbody>\n        <tr> \n            <td>Name</td>\n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.name : stack1), depth0))
    + " </td>\n        </tr>\n        <tr>\n            <td class=\"popup-tb-title\">Version</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.version : stack1), depth0))
    + "</td>\n        </tr>        \n        <tr>\n            <td class=\"popup-tb-title\">Id</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.id : stack1), depth0))
    + "</td>\n        </tr>\n        <tr> \n            <td class=\"popup-tb-title\">Language</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.language : stack1), depth0))
    + "\n            </td>\n        </tr>\n        <tr> \n            <td class=\"popup-tb-title\">Programming Language</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.programmingLanguage : stack1), depth0))
    + "\n            </td>\n        </tr>\n        <tr> \n            <td class=\"popup-tb-title\">Release</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\n            </td>\n        </tr>\n\n        <tr>\n            <td class=\"popup-tb-title\">Configuration</td>\n            <td  class=\"popup-tb-val\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.configuration : stack1), depth0))
    + "\n            </td>\n        </tr>\n                \n        <tr>\n            <td class=\"popup-tb-title\">Url</td>\n            <td  class=\"popup-tb-val\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.url : stack1), depth0))
    + "\n            </td>\n        </tr>\n        <tr>\n            <td class=\"popup-tb-title\">License</td>\n            <td  class=\"popup-tb-val\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.license : stack1), depth0))
    + " <br> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.engine : depth0)) != null ? stack1.licenseURL : stack1), depth0))
    + "\n            </td>\n        </tr>\n    </tbody>\n</table>\n\n";
},"useData":true});
this["Peace"]["templates"]["engine_sidebar_filters"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n    <h3 class=\"filter-group-title\" data-toggle=\"collapse\" data-target=\"#filter-items-engine-"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" aria-expanded=\"false\" aria-controls=\"filter-items-engine-"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.capitalize || (depth0 && depth0.capitalize) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"capitalize","hash":{},"data":data}))
    + " <span class=\"entypo-right-open\"></span></h3>\n\n<ul class=\"filter-items collapse\" id=\"filter-items-engine-"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n    <li><label class=\"filter-eng-item\"><input type=\"checkbox\" class=\"checkbox-filter\" data-engine-all=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\"all\" id=\"all_engine_"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"><span class=\"checkbox-icon\"></span> All</label></li>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <li><label class=\"filter-eng-item\"><input type=\"checkbox\" class=\"checkbox-filter\" data-dimension=\"engines\" data-engine=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><span class=\"checkbox-icon\"></span> "
    + alias3(((helper = (helper = helpers.versionLong || (depth0 != null ? depth0.versionLong : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"versionLong","hash":{},"data":data}) : helper)))
    + "</label></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n\n<ul class=\"filter-items\" id=\"filter-items-engine-lastest\">\n    <li><label class=\"filter-eng-item\"><input type=\"checkbox\" class=\"checkbox-filter\" value=\"latest\" id=\"cbox-lversions\" checked=\"\"><span class=\"checkbox-icon\"></span>Latest versions</label></li>\n</ul>\n\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["Peace"]["templates"]["expressiveness_table"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "             <th class=\"text-center engine-col-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" colspan=\""
    + alias2(this.lambda(((stack1 = (depth0 != null ? depth0.instances : depth0)) != null ? stack1.length : stack1), depth0))
    + "\"> "
    + alias2((helpers.capitalize || (depth0 && depth0.capitalize) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"capitalize","hash":{},"data":data}))
    + "</th>\n";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.escapeExpression, alias2=helpers.helperMissing, alias3="function";

  return "                    <th class=\"cell-version engine-col-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                         <a role=\"button\" tabindex=\"0\" data-engine-info=\""
    + alias1(((helper = (helper = helpers.indexEngine || (depth0 != null ? depth0.indexEngine : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"indexEngine","hash":{},"data":data}) : helper)))
    + "\" class=\"engine-info\" >\n                     "
    + alias1(((helper = (helper = helpers.versionLong || (depth0 != null ? depth0.versionLong : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"versionLong","hash":{},"data":data}) : helper)))
    + "</a></th>\n";
},"6":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                    <td>"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].summaryRow : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n";
},"8":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda(depth0, depth0))
    + " ";
},"10":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <tr "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " >\n\n                    <td "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n\n                    <td class=\"construct-col\">\n                        <div>\n                            <span class=\"entypo-right-open\"></span>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n                            <a title=\""
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" class=\"construct-info\">\n                                <span class=\"entypo-info\"></span>\n                            </a>\n                             "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.moreThanTwoFeatures : depth0),{"name":"if","hash":{},"fn":this.program(17, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                         </div>\n                    </td>\n\n                    <td class=\""
    + alias3(((helper = (helper = helpers.html_standard_class || (depth0 != null ? depth0.html_standard_class : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"html_standard_class","hash":{},"data":data}) : helper)))
    + "\"> "
    + alias3(((helper = (helper = helpers.upperBound || (depth0 != null ? depth0.upperBound : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"upperBound","hash":{},"data":data}) : helper)))
    + "  </td>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depths[1] != null ? depths[1].engines : depths[1]),{"name":"each","hash":{},"fn":this.program(19, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(23, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"11":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.escapeExpression;

  return " class=\"collapse-parent-row\" data-toggle=\"collapse\" data-target=\".row-feat-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" ";
},"13":function(depth0,helpers,partials,data) {
    return "class=\"border-top\"";
},"15":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return " <div>"
    + alias3(((helper = (helper = helpers.groupName || (depth0 != null ? depth0.groupName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"groupName","hash":{},"data":data}) : helper)))
    + " <a title=\""
    + alias3(((helper = (helper = helpers.groupDesc || (depth0 != null ? depth0.groupDesc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"groupDesc","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" class=\"group-info\">\n                        <span class=\"entypo-info\"></span>\n                    </a></div>";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return " <span class=\"info-badge\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1.length : stack1), depth0))
    + "</span> ";
},"19":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(20, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"20":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                 <td class=\"result\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].supportStatus : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(21, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                </td>\n";
},"21":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <span class=\""
    + alias3(((helper = (helper = helpers.html_class || (depth0 != null ? depth0.html_class : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"html_class","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"html","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"23":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "                    <!-- feature -->\n                    <tr class=\"collapse-header collapse row-feat-title row-feat-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n                        <td></td>\n                        <td class=\"collapse-title-cell\" "
    + ((stack1 = helpers.unless.call(depth0,(depths[1] != null ? depths[1].moreThanTwoFeatures : depths[1]),{"name":"unless","hash":{},"fn":this.program(24, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "><div class=\"collapse-title-border\">Pattern Implementations</div> </td>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depths[1] != null ? depths[1].moreThanTwoFeatures : depths[1]),{"name":"if","hash":{},"fn":this.program(26, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </tr>  \n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.features : depth0),{"name":"each","hash":{},"fn":this.program(32, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                     <!-- feature end-->\n";
},"24":function(depth0,helpers,partials,data,blockParams,depths) {
    return " colspan=\""
    + this.escapeExpression(this.lambda((depths[3] != null ? depths[3].featureTitleColspan : depths[3]), depth0))
    + "\"";
},"26":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                            <td class=\"collapse-header-cell\">"
    + alias2(alias1(((stack1 = (depths[2] != null ? depths[2].features : depths[2])) != null ? stack1.length : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depths[2] != null ? depths[2].features : depths[2])) != null ? stack1.length : stack1), depth0))
    + "</td>\n"
    + ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(27, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"27":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(28, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"28":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                     <td class=\"collapse-header-cell\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[4] != null ? depths[4].supportStatus : depths[4]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(29, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </td>\n";
},"29":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.engineID : depth0),{"name":"if","hash":{},"fn":this.program(30, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"30":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "                                            "
    + alias1(((helper = (helper = helpers.supportedFeature || (depth0 != null ? depth0.supportedFeature : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"supportedFeature","hash":{},"data":data}) : helper)))
    + "/"
    + alias1(this.lambda(((stack1 = (depths[5] != null ? depths[5].features : depths[5])) != null ? stack1.length : stack1), depth0))
    + "\n";
},"32":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "\n                    <tr class=\"collapse-row collapse row-feat-"
    + alias2(alias1((this.data(data, 2) && this.data(data, 2).index), depth0))
    + alias2(alias1((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                        <td class=\"collapse-feature-first-cell\"></td>\n                        <td class=\"collapse-feature-cell\">\n                            <div class=\"collapse-cell-border\">\n                                    <p>"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n                                    <a role=\"button\" tabindex=\"0\" data-feature-info=\""
    + alias2(((helper = (helper = helpers.featureIndex || (depth0 != null ? depth0.featureIndex : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"featureIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"info-feature\">\n                                    <span class=\"entypo-help-circled\"></span>\n                                    </a>\n                                </p>\n                            </div>\n                        </td>\n\n                        <td class=\""
    + alias2(((helper = (helper = helpers.html_standard_class || (depth0 != null ? depth0.html_standard_class : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html_standard_class","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.upperBound || (depth0 != null ? depth0.upperBound : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"upperBound","hash":{},"data":data}) : helper)))
    + "</td>\n"
    + ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(33, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </tr>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.lastFeature : depth0),{"name":"if","hash":{},"fn":this.program(38, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"33":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(34, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"34":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                                <td class=\"result\">\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,(depths[2] != null ? depths[2].results : depths[2]),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(35, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                </td>\n";
},"35":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.html : depth0),{"name":"if","hash":{},"fn":this.program(36, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"36":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "                                        <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[4] != null ? depths[4].featureIndex : depths[4]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[2] != null ? depths[2].id : depths[2]), depth0))
    + "\"  class=\"info-engine-test\" >\n                                         <span class=\""
    + alias2(((helper = (helper = helpers.html_class || (depth0 != null ? depth0.html_class : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html_class","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"html","hash":{},"data":data}) : helper)))
    + "</span>\n                                        </a>\n";
},"38":function(depth0,helpers,partials,data,blockParams,depths) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <tr class=\"feature-end collapse row-feat-"
    + alias2(alias1((this.data(data, 2) && this.data(data, 2).index), depth0))
    + alias2(alias1((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\">\n                        <td class=\"collapse-end-first-cell\"></td>\n                        <td class=\"collapse-end-cell\" colspan=\""
    + alias2(alias1((depths[4] != null ? depths[4].featureTitleColspan : depths[4]), depth0))
    + "\">\n                            <div class=\"collapse-end-border\"></div> \n                        </td>\n                    </tr> \n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "\n<table class=\"cap-table table\">\n    <thead>\n        <tr>\n            <th rowspan=\"3\" class=\"group-col th-last-child\">Group</th>\n            <th rowspan=\"3\" class=\"construct-col th-last-child\">Pattern</th>\n            <th rowspan=\"3\" class=\"standard-col th-last-child\"> "
    + alias1(((helper = (helper = helpers.language || (depth0 != null ? depth0.language : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"language","hash":{},"data":data}) : helper)))
    + " Standard</th>\n            <th class=\"text-center engine-col\" colspan=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.engines : depth0)) != null ? stack1.count : stack1), depth0))
    + "\">Engine</th> \n        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n\n    </thead>\n    <tbody>\n        <tr>\n            <td class=\"border-top\">∑</td>\n            <td class=\"construct-col\">"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.tests : depth0)) != null ? stack1.length : stack1), depth0))
    + "</td>\n            <td class=\"standard-col\">"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.tests : depth0)) != null ? stack1.length : stack1), depth0))
    + "</td>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tests : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tbody>   \n\n</table>\n";
},"useData":true,"useDepths":true});
this["Peace"]["templates"]["feature_description"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                    <li><span class=\"entypo-doc-text\"></span><a href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h3 class=\"feat-desc-title\">Feature</h3>\n\n<table class=\"table feature-desc\" width=\"100%\">\n    <tbody>\n        <tr> \n            <td class=\"popup-tb-title\">Feature Id</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.feature : depth0)) != null ? stack1.id : stack1), depth0))
    + " </td>\n        </tr>\n        <tr> \n            <td class=\"popup-tb-title\">Group</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.feature : depth0)) != null ? stack1.groupName : stack1), depth0))
    + " </td>\n        </tr>\n        <tr>\n            <td class=\"popup-tb-title\">Description</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.feature : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n        </tr>\n    </tbody>\n</table>\n\n<h3 class=\"feat-desc-title\">Test (Engine Independent)</h3>\n\n <table class=\"table feature-desc\" width=\"100%\">\n    <tbody>       \n        <tr>\n            <td  class=\"popup-tb-title\">Description</td>\n            <td colspan=2 class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.feature : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n        </tr>\n\n            <td class=\"popup-tb-title\"> LoadFunction</td>\n            <td class=\"popup-tb-title\">Description</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.description : stack1), depth0))
    + "</td>\n\n        <tr>\n            <td></td>\n            <td class=\"popup-tb-title\">Thinktime</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.thinkTime : stack1), depth0))
    + "</td>\n\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Ramp-Up Time</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.rampUpTime : stack1), depth0))
    + "</td>\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Steady-State Time</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.steadyStateTime : stack1), depth0))
    + "</td>\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Ramp-Down Time</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.rampDownTime : stack1), depth0))
    + "</td>\n        </tr>\n\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Connection Timeout</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.connectionTimeout : stack1), depth0))
    + "</td>\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Start Users</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.startUsers : stack1), depth0))
    + "</td>\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">Steady State Users</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.steadyStateUsers : stack1), depth0))
    + "</td>\n        </tr>\n        <tr><td></td>\n            <td class=\"popup-tb-title\">End Users</td>\n            <td class=\"popup-tb-val\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.loadFunction : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.endUsers : stack1), depth0))
    + "</td>\n        </tr>\n\n        <tr> \n            <td class=\"popup-tb-title\">Engine Independent Files</td>\n            <td colspan=2 class=\"popup-tb-val\">\n                <ul class=\"list-files\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engineIndependentFiles : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </td>\n        </tr>\n        <tr>\n            <td class=\"popup-tb-title\">Process Image</td>\n            <td colspan=2 class=\"popup-tb-val\">\n                <img alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.img : depth0)) != null ? stack1.alt : stack1), depth0))
    + "\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.img : depth0)) != null ? stack1.src : stack1), depth0))
    + "\" >\n            </td>\n        </tr>\n    </tbody>\n</table>\n";
},"useData":true});
this["Peace"]["templates"]["feature_test_description"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr>\n                <td class=\"tcase-number\"><div>"
    + alias3(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"number","hash":{},"data":data}) : helper)))
    + "</td>\n                <td class=\"tcase-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + " </td>\n                <td class=\"tcase-result tcase-result-"
    + alias3(((helper = (helper = helpers.resultType || (depth0 != null ? depth0.resultType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"resultType","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.breaklines || (depth0 && depth0.breaklines) || alias1).call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"breaklines","hash":{},"data":data}))
    + "</td>\n            </tr>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"list-files\"> \n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.engineDependentFiles : stack1),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"4":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <li><span class=\"entypo-doc-text\"></span><a target=\"_blank\" href=\"data/"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <p class=\"empty-message\">No files </p>\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"list-files\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.logFiles : stack1),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "\n<h3 class=\"test-desc-title\">Ids</h3>\n<table class=\"table feature-test-desc\" width=\"100%\">\n    <tbody>\n        <tr> \n            <td>Feature Id</td>\n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.featureID : stack1), depth0))
    + " </td>\n        </tr>\n        <tr> \n            <td>Engine Id</td>\n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.engineID : stack1), depth0))
    + " </td>\n        </tr>\n        <tr>\n            <td>Tool Id</td>\n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.toolID : stack1), depth0))
    + " </td>\n        </tr>\n    </tbody>\n</table>\n\n<h3 class=\"test-desc-title\">Description</h3>\n\n<table class=\"table feature-test-desc\" width=\"100%\">\n    <tbody>\n        <tr>\n            <td>Deployable</td> \n            <td class=\"test-desc-val tresult-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testDeployable : stack1), depth0))
    + "\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testDeployableHtml : stack1), depth0))
    + "</span> \n            "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testDeployable : stack1), depth0))
    + " </td>\n        </tr>\n        <tr>\n            <td>Successful</td>\n            <td class=\"test-desc-val tresult-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testSuccessful : stack1), depth0))
    + "\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testSuccessfulHtml : stack1), depth0))
    + "</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testSuccessful : stack1), depth0))
    + "</td>\n        </tr>   \n        <tr>\n            <td>Execution duration </td> \n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.executionDuration : stack1), depth0))
    + " ms</td>\n        </tr>\n        <tr>\n            <td>Execution date</td>\n            <td class=\"test-desc-val\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.executionTimestamp : stack1), depth0))
    + " </td>\n        </tr>\n    </tbody>\n</table> \n\n\n\n<h3 class=\"test-desc-title\">Test Cases</h3>\n\n<table class=\"table feature-testcases\" width=\"100%\">\n    <thead>    \n        <tr>\n            <th class=\"tcase-number-th\">#</th>\n            <th class=\"tcase-name-th\">Name</th>\n            <th class=\"tcase-result-th\">Result</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.testCases : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n</table> \n\n<h3 class=\"test-desc-title\">Engine Dependent Files</h3>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.engineDependentFiles : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\n<h3 class=\"test-desc-title\">Log files</h3>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.test : depth0)) != null ? stack1.logFiles : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});
this["Peace"]["templates"]["performance_table"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "             <th class=\"text-center engine-col-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" colspan=\""
    + alias2((helpers.math || (depth0 && depth0.math) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.instances : depth0)) != null ? stack1.length : stack1),"*",4,{"name":"math","hash":{},"data":data}))
    + "\"> "
    + alias2((helpers.capitalize || (depth0 && depth0.capitalize) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"capitalize","hash":{},"data":data}))
    + "</th>\n";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.escapeExpression, alias2=helpers.helperMissing, alias3="function";

  return "                    <th class=\"cell-version engine-col-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\" colspan=\"4\">\n                         <a role=\"button\" tabindex=\"0\" data-engine-info=\""
    + alias1(((helper = (helper = helpers.indexEngine || (depth0 != null ? depth0.indexEngine : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"indexEngine","hash":{},"data":data}) : helper)))
    + "\" class=\"engine-info\" >\n                     "
    + alias1(((helper = (helper = helpers.versionLong || (depth0 != null ? depth0.versionLong : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"versionLong","hash":{},"data":data}) : helper)))
    + "</a></th>\n";
},"6":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.features : depth0)) != null ? stack1['0'] : stack1)) != null ? stack1.metricTree : stack1),{"name":"each","hash":{},"fn":this.program(7, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " <!-- end metricTree -->\n";
},"7":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n            <tr class=\"collapse-header collapse in "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " row-feat-"
    + alias1(this.lambda((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\" aria-expanded=\"true\">\n                        <td  colspan=\"2\" class=\"collapse-title-cell "
    + alias1(((helper = (helper = helpers.category || (depth0 != null ? depth0.category : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(depth0,{"name":"category","hash":{},"data":data}) : helper)))
    + "\"><div class=\"collapse-title-border"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.isFirstEntry : depth0),{"name":"unless","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1((helpers.capitalize || (depth0 && depth0.capitalize) || alias2).call(depth0,(depth0 != null ? depth0.categoryName : depth0),{"name":"capitalize","hash":{},"data":data}))
    + " </div> </td>\n"
    + ((stack1 = helpers.each.call(depth0,(depths[2] != null ? depths[2].engines : depths[2]),{"name":"each","hash":{},"fn":this.program(16, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n                    </tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.metrics : depth0),{"name":"each","hash":{},"fn":this.program(19, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<!-- end metrics -->\n\n              ";
},"8":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "             <tr class=\"collapse-parent-row row-expanded\" data-toggle=\"collapse\" data-target=\".row-feat-"
    + alias2(alias1((this.data(data, 1) && this.data(data, 1).index), depth0))
    + "\" aria-expanded=\"true\" >\n\n                    <td class=\"construct-col\" colspan=2>\n                       <div>\n                           <span class=\"entypo-right-open\"></span>"
    + alias2(alias1((depths[2] != null ? depths[2].name : depths[2]), depth0))
    + "\n                            <a role=\"button\" tabindex=\"0\" data-toggle=\"tooltip\" data-feature-info=\""
    + alias2(alias1(((stack1 = ((stack1 = (depths[2] != null ? depths[2].features : depths[2])) != null ? stack1['0'] : stack1)) != null ? stack1.featureIndex : stack1), depth0))
    + "\" class=\"info-exp-feature\">\n                                <span class=\"entypo-help-circled\"></span>\n                            </a>\n                        </div>\n                    </td>\n"
    + ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n";
},"9":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "\n                 <td class=\"construct-col\" colspan=4>\n                     <div>\n\n                     <a role=\"button\" tabindex=\"0\"  data-test-info=\""
    + alias1(this.lambda(((stack1 = ((stack1 = (depths[4] != null ? depths[4].features : depths[4])) != null ? stack1['0'] : stack1)) != null ? stack1.featureIndex : stack1), depth0))
    + "\" data-test-engine=\""
    + alias1(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"info-engine-test\">\n                     <span class=\"entypo-help-circled\"></span>\n                 </a></div></td>\n";
},"12":function(depth0,helpers,partials,data) {
    return " row-feat-title ";
},"14":function(depth0,helpers,partials,data) {
    return " border-top";
},"16":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(17, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"17":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                                    <td class=\"metric-title "
    + alias2(alias1((depths[2] != null ? depths[2].category : depths[2]), depth0))
    + "-t"
    + ((stack1 = helpers.unless.call(depth0,(depths[2] != null ? depths[2].isFirstEntry : depths[2]),{"name":"unless","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">min</td>\n                                    <td class=\"metric-title "
    + alias2(alias1((depths[2] != null ? depths[2].category : depths[2]), depth0))
    + "-t"
    + ((stack1 = helpers.unless.call(depth0,(depths[2] != null ? depths[2].isFirstEntry : depths[2]),{"name":"unless","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">max</td>\n                                    <td class=\"metric-title "
    + alias2(alias1((depths[2] != null ? depths[2].category : depths[2]), depth0))
    + "-t"
    + ((stack1 = helpers.unless.call(depth0,(depths[2] != null ? depths[2].isFirstEntry : depths[2]),{"name":"unless","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">avg±ci</td>\n                                    <td class=\"metric-title-last "
    + alias2(alias1((depths[2] != null ? depths[2].category : depths[2]), depth0))
    + "-t"
    + ((stack1 = helpers.unless.call(depth0,(depths[2] != null ? depths[2].isFirstEntry : depths[2]),{"name":"unless","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">sd</td>\n";
},"19":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "\n                    <tr class=\"collapse-row collapse in row-feat-"
    + alias2(alias1((this.data(data, 2) && this.data(data, 2).index), depth0))
    + "\" aria-expanded=\"true\">\n                        <td  colspan=\"2\" class=\"collapse-feature-cell "
    + alias2(alias1((depths[1] != null ? depths[1].category : depths[1]), depth0))
    + "\">\n                            <div class=\"collapse-cell-border\">\n                                <p>"
    + alias2(((helper = (helper = helpers.metricName || (depth0 != null ? depth0.metricName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"metricName","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.metricUnit : depth0),{"name":"if","hash":{},"fn":this.program(20, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                </p>\n                            </div>\n                        </td>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depths[3] != null ? depths[3].engines : depths[3]),{"name":"each","hash":{},"fn":this.program(22, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<!-- end engine -->\n                    </tr>\n\n                    ";
},"20":function(depth0,helpers,partials,data) {
    var helper;

  return " in "
    + this.escapeExpression(((helper = (helper = helpers.metricUnit || (depth0 != null ? depth0.metricUnit : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"metricUnit","hash":{},"data":data}) : helper)));
},"22":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(23, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " <!-- end instance -->\n                        ";
},"23":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depths[4] != null ? depths[4].features : depths[4])) != null ? stack1['0'] : stack1)) != null ? stack1.results : stack1),(depth0 != null ? depth0.id : depth0),{"name":"getProperty","hash":{},"fn":this.program(24, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                             ";
},"24":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,depth0,{"name":"if","hash":{},"fn":this.program(25, data, 0, blockParams, depths),"inverse":this.program(45, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"25":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,depth0,(depths[5] != null ? depths[5].category : depths[5]),{"name":"getProperty","hash":{},"fn":this.program(26, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"26":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || helpers.helperMissing).call(depth0,(depths[5] != null ? depths[5].metric : depths[5]),"throughput",{"name":"if_eq","hash":{},"fn":this.program(27, data, 0, blockParams, depths),"inverse":this.program(33, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"27":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "\n                                              <td class=\"result-last\" colspan=\"4\">\n                                                    <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[5] != null ? depths[5].featureIndex : depths[5]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[4] != null ? depths[4].id : depths[4]), depth0))
    + "\"  class=\"info-engine-test\" >\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || helpers.helperMissing).call(depth0,depth0,(depths[6] != null ? depths[6].metric : depths[6]),{"name":"getProperty","hash":{},"fn":this.program(28, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    </a>\n                                                </td>\n\n";
},"28":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                                           "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.max : depth0),{"name":"if","hash":{"includeZero":true},"fn":this.program(29, data, 0),"inverse":this.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"29":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.max : depth0), depth0))
    + " ";
},"31":function(depth0,helpers,partials,data) {
    return "--";
},"33":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "                                                <td class=\"result\">\n                                                    <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[5] != null ? depths[5].featureIndex : depths[5]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[4] != null ? depths[4].id : depths[4]), depth0))
    + "\"  class=\"info-engine-test\" >\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || alias3).call(depth0,depth0,(depths[6] != null ? depths[6].metric : depths[6]),{"name":"getProperty","hash":{},"fn":this.program(34, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </a>\n                                                </td>\n                                                 <td class=\"result\">\n                                                    <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[5] != null ? depths[5].featureIndex : depths[5]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[4] != null ? depths[4].id : depths[4]), depth0))
    + "\"  class=\"info-engine-test\" >\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || alias3).call(depth0,depth0,(depths[6] != null ? depths[6].metric : depths[6]),{"name":"getProperty","hash":{},"fn":this.program(37, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    </a>\n                                                </td>\n                                                <td class=\"result\">\n                                                    <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[5] != null ? depths[5].featureIndex : depths[5]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[4] != null ? depths[4].id : depths[4]), depth0))
    + "\"  class=\"info-engine-test\" >\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || alias3).call(depth0,depth0,(depths[6] != null ? depths[6].metric : depths[6]),{"name":"getProperty","hash":{},"fn":this.program(39, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </a>\n                                                </td>\n                                                 <td class=\"result-last\">\n                                                    <a role=\"button\" tabindex=\"0\" data-test-info=\""
    + alias2(alias1((depths[5] != null ? depths[5].featureIndex : depths[5]), depth0))
    + "\" data-test-engine=\""
    + alias2(alias1((depths[4] != null ? depths[4].id : depths[4]), depth0))
    + "\"  class=\"info-engine-test\" >\n"
    + ((stack1 = (helpers.getProperty || (depth0 && depth0.getProperty) || alias3).call(depth0,depth0,(depths[6] != null ? depths[6].metric : depths[6]),{"name":"getProperty","hash":{},"fn":this.program(42, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </a>\n                                                </td>\n";
},"34":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                                           "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.min : depth0),{"name":"if","hash":{"includeZero":true},"fn":this.program(35, data, 0),"inverse":this.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"35":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.min : depth0), depth0))
    + " ";
},"37":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                                        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.max : depth0),{"name":"if","hash":{"includeZero":true},"fn":this.program(29, data, 0),"inverse":this.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"39":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                                        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['avg±ci'] : depth0),{"name":"if","hash":{"includeZero":true},"fn":this.program(40, data, 0),"inverse":this.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"40":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0['avg±ci'] : depth0), depth0))
    + " ";
},"42":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                                        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.sd : depth0),{"name":"if","hash":{"includeZero":true},"fn":this.program(43, data, 0),"inverse":this.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"43":function(depth0,helpers,partials,data) {
    return " "
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.sd : depth0), depth0))
    + " ";
},"45":function(depth0,helpers,partials,data) {
    return "                                        <td class=\"result\">\n                                        <td class=\"result\">\n                                        <td class=\"result\">\n                                        <td class=\"result-last\">\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n<table class=\"cap-table table\">\n    <thead>\n        <tr>\n            <th rowspan=\"4\" colspan=\"2\" class=\"construct-col th-last-child\">Experiment</th>\n            <th class=\"text-center engine-col\" colspan=\""
    + this.escapeExpression((helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.engines : depth0)) != null ? stack1.count : stack1),"*",4,{"name":"math","hash":{},"data":data}))
    + "\">Engine</th>\n        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n        <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.engines : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tr>\n\n    </thead>\n    <tbody>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tests : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tbody>\n\n</table>\n";
},"useData":true,"useDepths":true});
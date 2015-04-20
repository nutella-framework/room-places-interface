
var Resource = React.createClass({displayName: "Resource",
    componentDidMount: function () {

    },
    handleParameterChange: function(event) {
        var text = $("#"+event.target.id).text();

        // Pressed return
        if(event.which == 13) {
            $("#"+event.target.id).blur();
            $("#"+event.target.id).text(text);
        }
    },
    handleUpdateParameters: function() {
        var resource = this.props.resource;
        delete resource["parameters"];
        if(resource.continuous != undefined) {
            if(resource.continuous.x != undefined) {
                var number = parseFloat($("#"+this.props.resource.rid+"_parameter_x").text());
                if(!isNaN(number))
                    resource.continuous.x = number;
                else {
                    $("#" + this.props.resource.rid + "_parameter_x").text("s");
                }
            }
            if(resource.continuous.y != undefined) {
                var number = parseFloat($("#"+this.props.resource.rid+"_parameter_y").text());
                if(!isNaN(number))
                    resource.continuous.y = number;
                else
                    $("#"+this.props.resource.rid+"_parameter_y").text(resource.continuous.y);
            }
            if(resource.proximity_range != undefined) {
                var number = parseFloat($("#"+this.props.resource.rid+"_parameter_proximity").text());
                if(!isNaN(number))
                    resource.proximity_range = number;
                else
                    $("#"+this.props.resource.rid+"_parameter_proximity").text(resource.proximity_range);
            }
        }
        this.props.updateResource(resource);
    },
    handleContinousPressed: function() {
        var resource = this.props.resource;
        delete resource["discrete"];
        delete resource["proximity"];
        delete resource["parameters"];
        resource.continuous = {
            x: this.props.room.x/2,
            y: this.props.room.y/2
        };
        this.props.updateResource(resource);
    },
    handleDiscretePressed: function() {
        var resource = this.props.resource;
        delete resource["parameters"];
        delete resource["continuous"];
        delete resource["proximity"];
        resource.discrete = {
            x: 0,
            y: 0
        };
        this.props.updateResource(resource);
    },
    handleProximityPressed: function() {
        var resource = this.props.resource;
        delete resource["parameters"];
        delete resource["continuous"];
        delete resource["discrete"];
        resource.proximity = {};
        this.props.updateResource(resource);
    },
    handleDisablePressed: function() {
        var resource = this.props.resource;
        delete resource["continuous"];
        delete resource["discrete"];
        delete resource["parameters"];
        this.props.updateResource(resource);
    },
    handleDeletePressed: function() {
        this.props.removeResource(this.props.resource);
    },
    handleStaticPressed: function() {
        var resource = this.props.resource;
        delete resource["parameters"];
        if(resource.type == "STATIC")
            return;

        resource.type = "STATIC";
        resource.proximity_range = 1;
        delete resource["proximity"];
        delete resource["parameters"];
        this.props.updateResource(resource);
    },
    handleDynamicPressed: function() {
        var resource = this.props.resource;
        delete resource["parameters"];
        if(resource.type == "DYNAMIC")
            return;

        resource.type = "DYNAMIC";
        delete resource["proximity_range"];
        this.props.updateResource(resource);
    },
    handleAddKey: function() {
        var key = this.refs.key.getDOMNode().value.trim();
        var value = this.refs.value.getDOMNode().value.trim();

        this.refs.key.getDOMNode().value = "";
        this.refs.value.getDOMNode().value = "";

        var resource = this.props.resource;

        resource.parameters = [];

        resource.parameters.push({key: key, value: value});

        this.props.updateResource(resource);
    },
    handleKeyEnterPressed: function(event) {
        // Pressed return
        if(event.which == 13) {
            this.handleAddKey();
        }
    },
    handleModifyKey: function(event) {
        var key = $("#"+event.target.id.substring(0, event.target.id.length-1)+"k").text();
        var value = $("#"+event.target.id.substring(0, event.target.id.length-1)+"v").text();

        if(key == "") {
            $("#" + event.target.id.substring(0, event.target.id.length - 1) + "k").focus();
            return;
        }
        if(value == "") {
            $("#" + event.target.id.substring(0, event.target.id.length - 1) + "v").focus();
            return;
        }


        var prev_key = event.target.id.substring(this.props.resource.rid.length+1, event.target.id.length-2);
        var resource = this.props.resource;

        resource.parameters = [];

        resource.parameters.push({key: prev_key, delete: true});
        resource.parameters.push({key: key, value: value});

        this.props.updateResource(resource);
    },
    handleDeleteKey: function(event) {
        var key = event.target.id;

        var resource = this.props.resource;

        resource.parameters = [];

        resource.parameters.push({key: key, delete: true});

        this.props.updateResource(resource);
    },
    render: function () {
        var self = this;

         var parameters = [];

         if(this.props.resource.continuous != undefined ) {

             if(this.props.resource.continuous.x != undefined) {
                 parameters.push({key: "x", value: parseFloat(this.props.resource.continuous.x).toFixed(2)});
             }

             if(this.props.resource.continuous.y != undefined) {
                 parameters.push({key: "y", value: parseFloat(this.props.resource.continuous.y).toFixed(2)});
             }
         }

         if(this.props.resource.proximity_range != undefined) {
             parameters.push({key: "proximity", value: parseFloat(this.props.resource.proximity_range).toFixed(2)});
         }



         var parameterRows = parameters.map(function (parameter, index) {
             return(
                 React.createElement("tr", null, 
                     React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, React.createElement("span", null, parameter.key)), 
                     React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, 
                         React.createElement("span", {id: self.props.resource.rid+"_parameter_"+parameter.key, 
                             contentEditable: "true", 
                             onKeyDown: self.handleParameterChange, 
                             onKeyUp: self.handleParameterChange, 
                             onBlur: self.handleUpdateParameters}, 
                                parameter.value
                         )
                     )
                 )
             );
         });

        var parameterTable =
            React.createElement("table", {className: "table table-bordered table-striped table-hover", id: "resource_table"}, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, "Variable"), 
                        React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, "Value")
                    )
                ), 
                React.createElement("tbody", null, 
                    parameterRows
                )
            );

        if(parameterRows.length == 0)
            parameterTable = [];

        var keyValueRows = [];

        if(this.props.resource.parameters != undefined) {
            keyValueRows = Object.keys(this.props.resource.parameters).map(function (key, index) {
                return (
                    React.createElement("tr", null, 
                        React.createElement("td", {className: "col-md-6 key-values"}, 
                            React.createElement("span", {id: self.props.resource.rid+"_"+key+"_k", 
                                contentEditable: "true", 
                                onKeyPress: self.handleParameterChange, 
                                onBlur: self.handleModifyKey}, 
                                    key
                            )
                        ), 
                        React.createElement("td", {className: "col-md-6 key-values"}, 
                            React.createElement("span", {id: self.props.resource.rid+"_"+key+"_v", 
                                contentEditable: "true", 
                                onKeyPress: self.handleParameterChange, 
                                onBlur: self.handleModifyKey}, 
                                    self.props.resource.parameters[key]
                            ), 
                            React.createElement("button", {type: "button", onClick: self.handleDeleteKey, id: key, className: "btn btn-default btn-xs right"}, 
                                React.createElement("span", {className: "glyphicon glyphicon-remove", id: key, "aria-hidden": "true"})
                            )
                        )
                    )
                );
            });
        }

        var type = "";

        if(this.props.resource.type == "STATIC") {
            type = React.createElement("b", null, "S");
        }
        else if(this.props.resource.type == "DYNAMIC") {
            type = React.createElement("b", null, "D");
        }

        var trackingSystem = "";

        if(this.props.resource.continuous != undefined) {
            trackingSystem = React.createElement("i", {className: "fa fa-arrows fa-fw"});
        }
        else if(this.props.resource.discrete != undefined) {
            trackingSystem = React.createElement("i", {className: "fa fa-th-large fa-fw"});
        }
        else if(this.props.resource.proximity != undefined) {
            trackingSystem = React.createElement("i", {className: "fa fa-location-arrow fa-fw"});
        }
        else {
            trackingSystem = React.createElement("i", {className: "fa fa-ban fa-fw"});
        }

        var model = "";
        if(this.props.resource.model == "IMAC") {
            model = "icon-iMac";
        }
        else if(this.props.resource.model == "IPHONE") {
            model = "icon-iPhone";
        }
        else if(this.props.resource.model == "IPAD") {
            model = "icon-iPad";
        }
        else if(this.props.resource.model == "IBEACON") {
            model = "icon-iBeacon";
        }

        var proximity = {};
        if(this.props.resource.type == "DYNAMIC")
            proximity = React.createElement("li", {onClick: this.handleProximityPressed}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-location-arrow fa-fw"}), " Proximity"));

        return(

            React.createElement("tr", null, 
                React.createElement("td", {className: "col-md-12 col-sm-12 col-xs-12"}, 
                    React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, React.createElement("div", {className: "vertical-center"}, React.createElement("span", null, this.props.resource.rid))), 

                    React.createElement("div", {className: "col-md-1 col-sm-1 col-xs-1", style: {marginRight: "40px", marginTop: "8px"}}, 
                        React.createElement("span", {className: model, style: {fontSize: "20"}})
                    ), 

                    React.createElement("div", {className: "btn-group"}, 
                        React.createElement("a", {className: "btn btn-default", href: "#"}, trackingSystem), 
                        React.createElement("a", {className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", href: "#"}, 
                            React.createElement("span", {className: "fa fa-caret-down"})), 
                        React.createElement("ul", {className: "dropdown-menu"}, 
                            React.createElement("li", {onClick: this.handleContinousPressed}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-arrows fa-fw"}), " Continuous")), 
                            React.createElement("li", {onClick: this.handleDiscretePressed}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-th-large fa-fw"}), " Discrete")), 
                            proximity, 
                            React.createElement("li", {onClick: this.handleDisablePressed}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-ban fa-fw"}), " Disable")), 
                            React.createElement("li", {className: "divider"}), 
                            React.createElement("li", {onClick: this.handleDeletePressed}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-trash-o fa-fw"}), " Delete"))
                        )
                    ), 

                    React.createElement("div", {className: "btn-group", role: "group"}, 
                        React.createElement("div", {className: "btn-group", role: "group"}, 
                            React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-expanded": "false"}, 
                                type, 
                                React.createElement("span", {className: "caret"})
                            ), 
                            React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                                React.createElement("li", {onClick: this.handleStaticPressed}, React.createElement("a", {href: "#"}, React.createElement("b", null, "S"), " Static")), 
                                React.createElement("li", {onClick: this.handleDynamicPressed}, React.createElement("a", {href: "#"}, React.createElement("b", null, "D"), " Dynamic"))
                            )
                        )
                    ), 

                    React.createElement("div", {className: "right", "data-toggle": "collapse", "data-target": "#collapse-"+this.props.resource.rid}, 
                        React.createElement("button", {type: "button", className: "btn btn-default"}, React.createElement("span", {className: "glyphicon glyphicon-chevron-down", "aria-hidden": "true"}))
                    ), 

                    React.createElement("div", {className: "collapse", id: "collapse-"+this.props.resource.rid}, 
                        React.createElement("div", {style: {"padding": "20px"}}, 
                            parameterTable, 
                            React.createElement("table", {className: "table table-bordered table-striped table-hover", id: "resource_table"}, 
                                React.createElement("thead", null, 
                                    React.createElement("tr", null, 
                                        React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, "Key"), 
                                        React.createElement("td", {className: "col-md-6 col-sm-6 col-xs-6"}, "Value")
                                    )
                                ), 
                                React.createElement("tbody", null, 
                                    keyValueRows, 
                                    React.createElement("tr", null, 
                                        React.createElement("form", {onSubmit: this.handleAddKey}, 
                                            React.createElement("td", {className: "col-md-6"}, React.createElement("input", {onKeyPress: this.handleKeyEnterPressed, type: "text", className: "form-control", placeholder: "key", ref: "key"})), 
                                            React.createElement("td", {className: "col-md-6"}, React.createElement("input", {onKeyPress: this.handleKeyEnterPressed, type: "text", className: "form-control", placeholder: "value", ref: "value"}))
                                        )
                                    )
                                )
                            )
                        )
                    )

                )
            )
        );

    }
});

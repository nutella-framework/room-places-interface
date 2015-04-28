var InteractiveLabel = React.createClass({displayName: "InteractiveLabel",
    getInitialState: function () {
        return {
            value: this.props.labelValue
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            value: nextProps.labelValue
        });
    },
    onBlur: function() {
        this.onSubmit();
    },
    onSubmit: function() {
        if(this.props.id != undefined) {
            $("#"+this.props.id).attr("v", this.state.value);
        }
        this.props.onValueChange(this.props.labelName, this.props.labelKey, this.state.value);
        return false;
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function() {
        return (
            React.createElement("form", {onSubmit: this.onSubmit}, 
                this.props.id != undefined ?
                    React.createElement("input", {
                        id: this.props.id, 
                        className: "pointer", 
                        value: this.state.value, 
                        onKeyPress: this.props.onKeyPress, 
                        onChange: this.handleChange, 
                        onBlur: this.onBlur})
                    :
                    React.createElement("input", {
                        className: "pointer", 
                        value: this.state.value, 
                        onKeyPress: this.props.onKeyPress, 
                        onChange: this.handleChange, 
                        onBlur: this.onBlur})
                
            )
        )
    }
});
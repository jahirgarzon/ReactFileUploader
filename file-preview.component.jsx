import React from 'react'
class FilePreview extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            preview: null,
            type: null
        }

        this.fileReader = this.fileReader.bind(this);
    }
    fileReader(file) {
        const reader = new FileReader();
        reader.onload = e => this.setState({ preview: e.target.result, test: e.target })
        this.setState({ type: file.type })
        reader.readAsDataURL(file)

    }
    componentDidUpdate() {
        this.props.file ?
            this.fileReader(this.props.file) :
            this.setState({ preview: null })
    }
    render() {
        let thumb = {
            width: "70%",
            margin: "10px auto"
        }
        let obj = {
            width: "100%",
            height: "100%"
        }
        let handle = {
            padding: "10%",
            listStyleType: "none",
            margin: "0",
            border: "solid",
            borderRadius: '19px',
            borderWidth: "2px",
            borderColor: "grey"
        }
        let preview = this.state.preview ?
            this.props.type.includes("image") ?
                <img style={thumb} className="img-thumbnail" src={this.state.preview} /> :
                <div style={obj} draggable="true" >
                    <object data={this.state.preview} type="application/pdf" width="100%" height="100%" draggable="true"></object>
                </div> :
            <React.Fragment>
                <h3>{this.props.name}</h3>
                <h4>Click or Drop to Upload</h4>
                <h4>Drag out to Cancel</h4>
            </React.Fragment>
        return (
            <output  >
                <ul draggable="true" style={handle}>
                    {preview}
                </ul>
            </output>
        )
    }
}

export default FilePreview
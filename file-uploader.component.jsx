import React from 'react';
import cx from 'classnames'
import fileUploadService from '@app/services/fileUpload.service'
import FilePreview from '@app/components/admin/file-upload/file-preview.component.jsx'
class FileUploader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            within: false,
            valid: true,
            type: null
        }
        this.onChange = this.onChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount() {
        const dropZone = this.dropBox
        dropZone.addEventListener('dragover', this.onDragOver)
        dropZone.addEventListener('dragleave', this.onDragLeave)
        dropZone.addEventListener('drop', this.onDragDrop)
        dropZone.addEventListener('click', this.onClick)

        this.props.fileType.includes('pdf') ?
            this.setState({ type: "pdf" }) :
            this.props.fileType.includes("image") ?
                this.setState({ type: "image" }) :
                null
    }
    componentWillUnmount() {
        const dropZone = this.dropBox
        dropZone.removeEventListener('dragover', this.onDragOver)
        dropZone.removeEventListener('dragleave', this.onDragLeave)
        dropZone.removeEventListener('drop', this.onDragDrop)
        dropZone.removeEventListener('click', this.onClick)
    }
    onChange(e) {
        e.stopPropagation();
        e.preventDefault();
        let inputFiles = this.fileInput.files
        if (inputFiles.length > 0) {
            if (inputFiles[0].type.includes(this.state.type)) {
                this.setState({
                    file: inputFiles[0],
                    valid: inputFiles[0].type.includes(this.state.type),
                    within: true
                })
            }
        }
        else {
            this.setState({
                valid: false,
                file: null
            })
        }
        return false;
    }

    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ within: true })
        return false;
    }
    onDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            within: false,
            file: null,
            valid: true
        })
        this.fileInput.value = ""
        return false;
    }
    onDragDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        let dragFiles = e.dataTransfer.files
        if (this.state.valid && dragFiles[0].type.includes(this.state.type)) {
            this.setState({
                file: dragFiles[0],
                valid: true
            })
        }
        else {
            this.setState({
                file: null,
                valid: false
            })
        }
        return false;
    }
    onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.fileInput.click()
    }
    uploadFile(e) {
        e.preventDefault();
        if (this.state.file) {
            const file = this.state.file
            fileUploadService.signingAndUpload(file)
                .then(response => this.props.onSuccess(response.url.split('?')[0]))
                .then(this.setState({
                    file: null,
                    within: false
                }))
        }
    }
    render() {
        let input = {
            display: "none",
            fontSize: "6em"
        };
        let icon = {
            textAlign: "center",
            color: '#394142',
            fontSize: '60px'
        };
        let dropboxStyle = {
            width: "100%",
            borderRadius: '20px',
            boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.43)'
        };

        let dropboxClasses = cx('alert', {
            'alert-default': !this.state.within, 'alert-success': this.state.within && this.state.valid,
            'alert-danger': this.state.within && !this.state.valid
        }, 'text-center')

        return (
            <React.Fragment>
                <span onChange={this.onChange}>
                    <input id="input" name="input" style={input} type="file" accept={this.props.fileType} ref={input => { this.fileInput = input }} />

                </span>
                <div style={dropboxStyle} name="dropZone" className={dropboxClasses} >
                    <div ref={dropBox => this.dropBox = dropBox}>
                        < i style={icon} className="et-upload" />
                        <FilePreview file={this.state.file} type={this.props.fileType} name={this.props.name} />
                    </div>
                    <button onClick={this.uploadFile} className="btn btn-primary">Upload</button>
                </div>

            </React.Fragment>
        )
    }
}

export default FileUploader
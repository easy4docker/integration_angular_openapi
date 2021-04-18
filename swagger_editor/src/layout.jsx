import React from "react"
import PropTypes from "prop-types"
import Dropzone from "react-dropzone"
import axios from 'axios'

Dropzone.displayName = "Dropzone" // For testing

export default class EditorLayout extends React.Component {
  
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      syncMessage : ''
    };
  }
  syncData = {
      upDatedYaml : ''
  }
  onChange = (newYaml, origin="editor") => {
    this.syncData.upDatedYaml = newYaml;
    this.props.specActions.updateSpec(newYaml, origin)
  }


  saveAndClose = () => {
    const me = this;
    me.syncData.message = '';
    axios.post('//localhost:10000/updateSwagger', {
      fn : '3.0.1.YAML',
      content: me.syncData.upDatedYaml
    })
    .then((response) => {
      me.setState({syncMessage : (!response || !response.data || response.data.status !== 'success') ? response.data.message : 
        (!response.data.message) ? 'Success updated!' : response.data.message});
    }).catch((error) => {
      me.setState({syncMessage : error.message});
    }).then(() => {
      setTimeout(() => {
        me.setState({syncMessage : ''});
      }, 6000)
    })
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0
    const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1
    if ( someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
      alert("Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
    } else {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const spec = reader.result
        this.onChange(spec, "fileDrop")
      }

      reader.readAsText(file, "utf-8")
    }
  }

  render() {
    const { getComponent } = this.props

    const UIBaseLayout = getComponent("BaseLayout", true)
    const EditorContainer = getComponent("EditorContainer", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)

    const Container = getComponent("Container")

    return (
      <div className="swagger-editor text-left bg-info">
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <button className="btn btn-sm btn-warning m-1 border border-secondary" onClick={this.saveAndClose}>Sync To Server</button>
            </div>
            <div className="col-8 test-right p-1">
                {(!this.state.syncMessage) ? '' : <div className="text-warning p-0">{this.state.syncMessage}</div>}
            </div>
          </div>
        </div>
        <Container className="container">
          <Dropzone
            className="dropzone"
            accept=".yaml,application/json"
            multiple={false}
            onDrop={this.onDrop}
            disablePreview
            disableClick
          >
          {({ isDragActive }) => {
            if (isDragActive) {
              return (
                <div className="dropzone__overlay">
                  Please drop a .yaml or .json OpenAPI spec.
                </div>
              )
            } else {
              return (
                <SplitPaneMode>
                  <EditorContainer onChange={this.onChange} />
                  <UIBaseLayout/>
                </SplitPaneMode>
              )
            }
          }}
          </Dropzone>
        </Container>
      </div>
    )
  }
}

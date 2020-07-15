import React, { Component } from 'react';
import axios from 'axios';
import ResponsiveNavigation from '../components/ResponsiveNavigation';
import '../styling/canvas.css';
import Draggable from 'react-draggable';
import Modal from 'react-awesome-modal';
import { Menu, Item, MenuProvider, animation } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import { Rnd } from "react-rnd";
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from 'custom-williams-block-build/build/ckeditor';
import TextareaAutosize from 'react-autosize-textarea';
var Spinner = require('react-spinkit');

class Canvas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            netid: '',

            stress: '',
            strengths: '',
            behaviors: '',
            energy: '',
            experience_bias: '',
            voice: '',
            values: '',
            fixed_mindset: '',
            growth_mindset: '',
            vision: '',
            purpose: '',
            deliberate_practices: '',

            loggedIn: true,

            loaderVisibility: 'hidden',
            
            visible : false,

            stressDrags: [],
            strengthsDrags: [],
            behaviorsDrags: [],
            energyDrags: [],
            expBiasDrags: [],
            voiceDrags: [],
            valuesDrags: [],
            fixedMindsetDrags: [],
            growthMindsetDrags: [],
            visionDrags: [],
            purposeDrags: [],
            delibPracticesDrags: [],

            focusedOnImg: false,

            imgList: ["https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0"],

            browserWidth: window.innerWidth,
            browserHeight: window.innerHeight,

            imgXDensity: 10/window.innerWidth,
            imgYDensity: 10/window.innerHeight,
            imgWidth: '10vw',
            imgHeight: '10vh',
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.infoTimer = null;
        this.setloaderVisibility = this.setloaderVisibility.bind(this);
        this.updateInfo = this.updateInfo.bind(this);

        this.editorConfiguration = {
            toolbar: [
                'undo',
                'redo',
                '|',
                'bold',
                'italic',
                'bulletedList',
                'numberedList',
                '|',
                'fontSize',
                'fontFamily',
                '|',
                'heading',
            ],
            simpleUpload: {
                uploadUrl: 'http://localhost:9000/img_upload',
                withCredentials: true,
            }
        };

        this.img1Ref = React.createRef();
        this.img2Ref = React.createRef();
        this.img3Ref = React.createRef();
        this.img4Ref = React.createRef();
        this.img5Ref = React.createRef();


        this.onImageClick = ({ event, props }) => this.openModal();
        this.onGifClick = ({ event, props }) => this.openModal();

        this.stressContext = () => (this.getContextMenuItems('stress'));
        this.strengthsContext = () => (this.getContextMenuItems('strengths'));
        this.behaviorsContext = () => (this.getContextMenuItems('behaviors'));
        this.energyContext = () => (this.getContextMenuItems('energy'));
        this.expBiasContext = () => (this.getContextMenuItems('experience_bias'));
        this.voiceContext = () => (this.getContextMenuItems('voice'));
        this.valuesContext = () => (this.getContextMenuItems('values'));
        this.fixedMindsetContext = () => (this.getContextMenuItems('fixed_mindset'));
        this.growthMindsetContext = () => (this.getContextMenuItems('growth_mindset'));
        this.visionContext = () => (this.getContextMenuItems('vision'));
        this.purposeContext = () => (this.getContextMenuItems('purpose'));
        this.delibPracticesContext = () => (this.getContextMenuItems('deliberate_practices'));
    }

    getContextMenuItems(id) {
        return (
            <Menu id={id+'_context'} animation={animation.fade}>
            <Item onClick={() => this.onImageClick(id)}>Add Image</Item>
            <Item onClick={() => this.onGifClick(id)}>Add Gif</Item>
            <Item disabled={!this.state.focusedOnImg} onClick={() => this.deleteImage(id)}>Delete Image</Item>
            </Menu>
        );
    }

    deleteImage(id) {

    }

    updateWindowDimensions() {
        this.setState({ browserWidth: window.innerWidth, browserHeight: window.innerHeight });
        this.setState({ imgXDensity: this.state.imgXDensity, imgYDensity: this.state.imgYDensity });


        var width=this.rBound/window.innerWidth;
        var height=this.bBound/window.innerHeight;
        this.setState({ rightBounds: [width, width, width, width, width, width, width, 2*width, 2*width, 5*width, width, width],
                        bottomBounds: [height, height, height, height, 2*height, 2*height, height, height, height, height, height, height] })
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        axios.get('http://localhost:9000/userinfo', {withCredentials: true})
            .then(res => {
                var data = res.data;
                if(data.netid) {
                    this.setState({loggedIn: true})
                    this.setState({firstName: data.firstName, lastName: data.lastName, netid: data.netid, stress: data.stress,
                                   strengths: data.strengths, behaviors: data.behaviors, energy: data.energy, experience_bias: data.experience_bias,
                                   voice: data.voice, values: data.values, fixed_mindset: data.fixed_mindset, growth_mindset: data.growth_mindset,
                                   vision: data.vision, purpose: data.purpose, deliberate_practices: data.deliberate_practices});
                } else {
                    this.setState({loggedIn: false})
                }
        });
    }

    setloaderVisibility(visiblility){
        this.setState({
            loaderVisibility: visiblility
        })
    }

    getUserInfoText() {
        if(this.state.loggedIn) {
            return (
                <div>   
                    <h1>{this.state.firstName} {this.state.lastName}'s Canvas</h1>
                    <h3>Your netID is {this.state.netid}</h3>
                    <p>{this.state.problem}</p>
                </div>
            )
        } else {
            return (
                <div>You are not logged in!</div>
            )
        }
    }

    handleTextChange(value, id) {
        
        switch(id) {
            case 'stress':
                this.setState({stress: value});
                break;
            case 'strengths':
                this.setState({strengths: value});
                break;
            case 'behaviors':
                this.setState({behaviors: value});
                break;
            case 'energy':
                this.setState({energy: value});
                break;
            case 'experience_bias':
                this.setState({experience_bias: value});
                break;
            case 'voice':
                this.setState({voice: value});
                break;
            case 'values':
                this.setState({values: value});
                break;
            case 'fixed_mindset':
                this.setState({fixed_mindset: value});
                break;
            case 'growth_mindeet':
                this.setState({growth_mindset: value});
                break;
            case 'vision':
                this.setState({vision: value});
                break;
            case 'purpose':
                this.setState({purpose: value});
                break;
            case 'deliberate_practices':
                this.setState({deliberate_practices: value});
                break;
            default:            
        }
        this.setInfoTimer();
    }

    getTextCard(text, id) {
        return (
            <CKEditor
                editor={ BalloonEditor }
                config={ this.editorConfiguration }
                data={ text }
                onInit={ editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    this.handleTextChange(data, id);
                } }
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
                
            />
        )
    }
    
    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    setInfoTimer() {
        if(this.infoTimer != null) {
            clearTimeout(this.infoTimer);
        }
        this.infoTimer = setTimeout(this.updateInfo,1000);
    }
  
    updateInfo() {
        this.setloaderVisibility('visible');

        var userData = {stress: this.state.stress, strengths: this.state.strengths, behaviors: this.state.behaviors, energy: this.state.energy,
                        experience_bias: this.state.experience_bias, voice: this.state.voice, values: this.state.values, fixed_mindset: this.state.fixed_mindset,
                        growth_mindset: this.state.growth_mindset, vision: this.state.vision, purpose: this.state.purpose,
                        deliberate_practices: this.state.deliberate_practices};
        
        console.log(userData);

        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', 'http://localhost:9000/canvas_data', true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    this.setloaderVisibility('hidden');
                } else {
                    console.log('request failed '+status);
                }
            }
        }.bind(this);

        xhr.send(JSON.stringify(userData));
    }

    getImgDragComp(i) {
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        return (
            <Draggable {...dragHandlers}
                handle=".img__handle"
            >
                <div style={{ position: 'absolute', zIndex: 400}}>
                    <div className='img__minor'>
                    <div className="img__handle"></div>

                        <button className="image" style={{resize: "both", backgroundImage: 'url('+this.state.imgList[i]+')'}}/>

                    </div>
                </div>
            </Draggable>
        )
    }

    addImgDrag(button) {
        console.log(button.id);
        switch(button.id) {
            case 'img1':
                this.state.imgDrags.push(this.getImgDragComp(0));
                break;
            case 'img2':
                this.state.imgDrags.push(this.getImgDragComp(1));
                break;
            case 'img3':
                this.state.imgDrags.push(this.getImgDragComp(2));
                break;
            case 'img4':
                this.state.imgDrags.push(this.getImgDragComp(3));
                break;
            case 'img5':
                this.state.imgDrags.push(this.getImgDragComp(4));
                break;
            default:
                break;
        }
    }

    setImgFocus() {
        this.setState({focusedOnImg: true});
        console.log('focused');
    }

    setImgBlur() {
        this.setState({focusedOnImg: false});
        console.log('blurred');
    }

    render () {

        return (
            <div>
                
                <Modal visible={this.state.visible} width="800" height="500" onClickAway={() => this.closeModal()}>
                    <div>
                        <h1>Add an Image</h1>
                        <p>Just click on an image to add it to your canvas.</p>
                        
                    </div>

                    <br/>

                    <TextareaAutosize placeholder='Search an image...' style={{resize: "none"}} rows={1} />

                    <br/><br/>

                    <div className="grid" id="grid">
                        <div>
                            <div className="grid" style={{display: 'flex', flexDirection: 'row'}}>
                                <div ref={this.img1Ref} className="image"><button id="img1" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                                <br/>
                                <div ref={this.img2Ref} className="image"><button id="img2" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                                <br/>
                                <div ref={this.img3Ref} className="image"><button id="img3" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                            </div>
                            <div className="grid" style={{display: 'flex', flexDirection: 'row'}}>
                                <div ref={this.img4Ref} className="image"><button id="img4" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                                <br/>
                                <div ref={this.img5Ref} className="image"><button id="img5" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                                <br/>
                                <div ref={this.img5Ref} className="image"><button id="img6" className="img__button" onClick={e => this.addImgDrag(e.target)}/></div>
                            </div>
                        </div>
                    </div>

                    <br/><br/>
                    
                    <button onClick={() => this.closeModal()}>Close</button>
                </Modal>

                <ResponsiveNavigation loggedIn={this.state.loggedIn}/>

                <br/>
                
                <div>
                    <h1>Welcome to {this.state.firstName}'s Canvas!</h1>
                    <p>Try making it your own. You can add resizable pictures and gifs, and you can edit each text to map out your story.</p>
                    <p>Your changes are automatically saved.</p>
                </div>

                    <div className='canvas'>

                        <Spinner className='loader' color='lightgray' style={{visibility: this.state.loaderVisibility}}/>
                        <br/>

                        <div className='canvas__top'>

                            <MenuProvider id='vision_context' >
                                <this.visionContext />
                                <div className='row__long' >
                                    {this.getTextCard(this.state.vision, 'vision')}
                                    { this.state.visionDrags.map((img, index) => <div key={index}>{img}</div>) }

                                    <Rnd
                                            style={{display: 'flex', flexDirection: 'column'}}
                                            bounds='parent'
                                            position={{ x: this.state.browserWidth*this.state.imgXDensity, y: this.state.browserHeight*this.state.imgYDensity }}
                                            size={{ width: this.state.imgWidth, height: this.state.imgHeight }}
                                            onDragStop={(e, d) => {
                                                this.setState({ imgXDensity: d.x/this.state.browserWidth, imgYDensity: d.y/this.state.browserHeight });
                                            }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                console.log(position);
                                                this.setState({
                                                imgWidth: ref.style.width,
                                                imgHeight: ref.style.height,
                                                ...position
                                                });
                                            }}
                                        >

                                                <button style={{flex: 1}} onBlur={this.setImgBlur.bind(this)} onMouseDown={this.setImgFocus.bind(this)}
                                                    className='img__button'></button>
                                                <TextareaAutosize placeholder='meaning...' style={{resize: "none"}} rows={1} onMouseDown={e => e.stopPropagation()}/>
                                        </Rnd>
                                </div>
                            </MenuProvider>

                        </div>
                        
                        <div className='canvas__middle'>

                            <div className='col__first'>

                                <MenuProvider id='stress_context' >
                                    <this.stressContext />
                                    <div className='col__short' style={{borderRight: 0, borderBottom: 0, borderTop: 0}}>
                                        {this.getTextCard(this.state.stress, 'stress')} 
                                        { this.state.stressDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>

                                <MenuProvider id='behaviors_context' >
                                    <this.behaviorsContext />
                                    <div className='col__short' style={{borderRight: 0, borderBottom: 0, zIndex: 10}}>

                                        {this.getTextCard(this.state.behaviors, 'behaviors')} 
                                        { this.state.behaviorsDrags.map((img, index) => <div key={index}>{img}</div>) }
                                        
                                    </div>
                                </MenuProvider>

                            </div>

                            <div className='col__second'>
                                <MenuProvider id='experience_bias_context' >
                                    <this.expBiasContext />
                                    <div className='col__long' style={{borderTop: 0, borderBottom: 0}}>
                                        {this.getTextCard(this.state.experience_bias, 'experience_bias')}
                                        { this.state.expBiasDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>
                            </div>

                            <div className='col__third'>
                                <MenuProvider id='deliberate_practices_context' >
                                    <this.delibPracticesContext />
                                    <div className='col__short' style={{borderRight: 0, borderLeft: 0, borderTop: 0}}>
                                        {this.getTextCard(this.state.deliberate_practices, 'deliberate_practices')}
                                        { this.state.delibPracticesDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>

                                <MenuProvider id='purpose_context' >
                                    <this.purposeContext />
                                    <div className='col__short' style={{borderLeft: 0, borderTop: 0, borderRight: 0, borderBottom: 0}}>
                                        {this.getTextCard(this.state.purpose, 'purpose')}
                                        { this.state.purposeDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>
                            </div>

                            <div className='col__fourth'>
                                <MenuProvider id='voice_context' >
                                    <this.voiceContext />
                                    <div className='col__long' style={{borderRight: 0, borderTop: 0, borderBottom: 0}}>
                                        {this.getTextCard(this.state.voice, 'voice')}
                                        { this.state.voiceDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>
                            </div>

                            <div className='col__fifth'>
                                <MenuProvider id='strengths_context' >
                                    <this.strengthsContext />
                                    <div className='col__short' style={{borderBottom: 0, borderTop: 0}}>
                                        {this.getTextCard(this.state.strengths, 'strengths')} 
                                        { this.state.strengthsDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>

                                <MenuProvider id='energy_context' >
                                    <this.energyContext />
                                    <div className='col__short' style={{borderBottom: 0}}>
                                        {this.getTextCard(this.state.energy, 'energy')}
                                        { this.state.energyDrags.map((img, index) => <div key={index}>{img}</div>) }
                                    </div>
                                </MenuProvider>
                            </div>

                        </div>

                        <div className='canvas__bottom'>
                            <MenuProvider id='fixed_mindset_context' >
                                <this.fixedMindsetContext />
                                <div className='row__short'>
                                    {this.getTextCard(this.state.fixed_mindset, 'fixed_mindset')}
                                    { this.state.fixedMindsetDrags.map((img, index) => <div key={index}>{img}</div>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='values_context' >
                                <this.valuesContext />
                                <div className='col__short__short' style={{borderLeft: 0, borderRight: 0}}>
                                    {this.getTextCard(this.state.values, 'values')}
                                    { this.state.valuesDrags.map((img, index) => <div key={index}>{img}</div>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='growth_mindset_context' >
                                <this.growthMindsetContext />
                                <div className='row__short'>
                                    {this.getTextCard(this.state.growth_mindset, 'growth_mindset')}
                                    { this.state.growthMindsetDrags.map((img, index) => <div key={index}>{img}</div>) }
                                </div>
                            </MenuProvider>

                        </div>

                        <br/>

                    </div>
                    
                    <br/>

            </div>
        )
    }
}

export default Canvas
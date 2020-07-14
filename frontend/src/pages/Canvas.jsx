import React, { Component } from 'react';
import axios from 'axios';
import ResponsiveNavigation from '../components/ResponsiveNavigation';
import '../styling/canvas.css';
import Draggable from 'react-draggable';
import Modal from 'react-awesome-modal';
import { Menu, Item, MenuProvider, animation } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from 'custom-williams-block-build/build/ckeditor';

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

            imgDrags: [],
            imgList: ["https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0",
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NjQ3NX0"]
        }

        this.infoTimer = null;
        this.setloaderVisibility = this.setloaderVisibility.bind(this);
        this.updateInfo = this.updateInfo.bind(this);

        this.editorConfiguration = {
            toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'bulletedList',
                'numberedList',
                '|',
                'fontSize',
                'fontFamily',
                '|',
                'imageUpload',
                'link',
                '|',
                'undo',
                'redo',
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


        const onImageClick = ({ event, props }) => this.openModal();
        const onGifClick = ({ event, props }) => this.openModal();
        // create your menu first
        this.MyAwesomeMenu = () => (
            <Menu id='menu_id' animation={animation.fade}>
            <Item onClick={onImageClick}>Add Image</Item>
            <Item onClick={onGifClick}>Add Gif</Item>
            </Menu>
        );
    }

    componentDidMount() {
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
            <Draggable
                bounds={{right: '10%', left: 0, top: 0, bottom: 500}}
                axis='both'
                handle=".handle"
                defaultPosition={{x: 0, y: 0}}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
                >
                    <div className='minor'>
                    <div className="handle" style={{zIndex: 0}}></div>

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

                    </div>
            </Draggable>
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
        return (
            <Draggable
                axis='both'
                handle=".img__handle"
                defaultPosition={{x: 9, y: 0}}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
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

    render () {
        return (
            <div>
                
                <ResponsiveNavigation loggedIn={this.state.loggedIn}/>

                <br/>

                <Modal visible={this.state.visible} width="800" height="500" onClickAway={() => this.closeModal()}>
                    <div>
                        <h1>Search for an Image</h1>
                        <p>Just click on an image to add it to your canvas.</p>
                        <button onClick={() => this.closeModal()}>Close</button>
                        
                    </div>
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
                            </div>
                        </div>
                    </div>
                </Modal>

                    <div className='canvas'>

                    <MenuProvider id="menu_id" style={{position: "relative"}} >

                        <this.MyAwesomeMenu />

                        { this.state.imgDrags.map((img, index) => <div key={index}>{img}</div>) }

                        <div className='canvas__top'>

                            <div className='row__long' >
                                {this.getTextCard(this.state.vision, 'vision')}
                            </div>

                        </div>
                        
                        <div className='canvas__middle'>

                            <div className='col__first'>

                                <div className='col__short' style={{borderRight: 0, borderBottom: 0, borderTop: 0}}>
                                    {this.getTextCard(this.state.stress, 'stress')} 
                                </div>

                                <div className='col__short' style={{borderRight: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.behaviors, 'behaviors')} 
                                </div>

                            </div>

                            <div className='col__second'>
                                
                                <div className='col__long' style={{borderTop: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.experience_bias, 'experience_bias')}
                                </div>

                            </div>

                            <div className='col__third'>

                                <div className='col__short' style={{borderRight: 0, borderLeft: 0, borderTop: 0}}>
                                    {this.getTextCard(this.state.deliberate_practices, 'deliberate_practices')} 
                                </div>

                                <div className='col__short' style={{borderLeft: 0, borderTop: 0, borderRight: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.purpose, 'purpose')} 
                                </div>

                            </div>

                            <div className='col__fourth'>

                                <div className='col__long' style={{borderRight: 0, borderTop: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.voice, 'voice')}
                                </div>

                            </div>

                            <div className='col__fifth'>

                                <div className='col__short' style={{borderBottom: 0, borderTop: 0}}>
                                    {this.getTextCard(this.state.strengths, 'strengths')} 
                                </div>

                                <div className='col__short' style={{borderBottom: 0}}>
                                    {this.getTextCard(this.state.energy, 'energy')} 
                                </div>

                            </div>

                        </div>

                        <div className='canvas__bottom'>

                            <div className='row__short'>
                                {this.getTextCard(this.state.fixed_mindset, 'fixed_mindset')}
                            </div>

                            <div className='col__short__short' style={{borderRight: 0, borderLeft: 0}}>
                                {this.getTextCard(this.state.values, 'values')} 
                            </div>

                            <div className='row__short'>
                                {this.getTextCard(this.state.growth_mindset, 'growth_mindset')}
                            </div>

                        </div>

                        <br/>

                        <Spinner className='loader' color='lightgray' style={{visibility: this.state.loaderVisibility}}/>

                        </MenuProvider>

                    </div>
                    
                    <br/>

            </div>
        )
    }
}

export default Canvas
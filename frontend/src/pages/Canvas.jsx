import React, { Component, Fragment } from 'react';
import axios from 'axios';
import MaterialNavBar from '../components/MaterialNavBar';
import '../styling/canvas.css';
import { Menu, Item, MenuProvider, animation } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import { Rnd } from "react-rnd";
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from 'custom-williams-block-build/build/ckeditor';
import TextareaAutosize from 'react-autosize-textarea';

import { Link } from "@reach/router";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';

import $ from 'jquery'; 
import { DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import OutlinedCard from '../components/OutlinedCard';

var Spinner = require('react-spinkit');

class Canvas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: null,
            canvasVisible: 'hidden',

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

            stressDragObj: new Map(),
            strengthsDragObj: new Map(),
            behaviorsDragObj: new Map(),
            energyDragObj: new Map(),
            expBiasDragObj: new Map(),
            voiceDragObj: new Map(),
            valuesDragObj: new Map(),
            fixedMindsetDragObj: new Map(),
            growthMindsetDragObj: new Map(),
            visionDragObj: new Map(),
            purposeDragObj: new Map(),
            delibPracticesDragObj: new Map(),

            loaderVisibility: 'hidden',

            isDialogOpen: false,
            searchDialogVisibility : false,
            searchTerm: '',
            noResults: 'hidden',
            searchLoaderVisibility: 'hidden',
            gifSearch: false,
            searchDest: '',
            searchImgList: ['null', 'null', 'null', 'null', 'null', 'null'],

            focusedOnImg: false
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.topDivRef = React.createRef();
        this.middleDivRef = React.createRef();
        this.col1DivRef = React.createRef();
        this.col2DivRef = React.createRef();
        this.col3DivRef = React.createRef();
        this.col4DivRef = React.createRef();
        this.col5DivRef = React.createRef();
        this.bottomDivRef = React.createRef();

        this.dragIndex = 0;
        this.focusedId = -1;
        this.setImgBlur = this.setImgBlur.bind(this);
        this.setImgFocus = this.setImgFocus.bind(this);

        this.justDeletedIndex = -1;

        this.imgTimer = null;
        this.gifTimer = null;
        this.infoTimer = null;
        this.updateInfo = this.updateInfo.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.pressedEnter = false;

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
            ]
        };

        this.handleClickOpen = (id, gif) => {
            this.setState({
                noResults: 'hidden',
                isDialogOpen: true,
                gifSearch: gif,
                searchDest: id,
                searchTerm: '',
                searchImgList: []
            });
        };

        this.handleClose = () => {
            this.setState({isDialogOpen: false});
        };

        this.onImageClick = (id) => this.handleClickOpen(id, false);
        this.onGifClick = (id) => this.handleClickOpen(id, true);

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
        var key = this.focusedId;
        var imgObj;
        switch(id) {
            case 'stress':
                imgObj = this.state.stressDragObj;
                imgObj.get(key).visible = false;
                this.setState({stressDragObj: imgObj});
                break;
            case 'strengths':
                imgObj = this.state.strengthsDragObj;
                imgObj.get(key).visible = false;
                this.setState({strengthsDragObj: imgObj});
                break;
            case 'behaviors':
                imgObj = this.state.behaviorsDragObj;
                imgObj.get(key).visible = false;
                this.setState({behaviorsDragObj: imgObj});
                break;
            case 'energy':
                imgObj = this.state.energyDragObj;
                imgObj.get(key).visible = false;
                this.setState({energyDragObj: imgObj});
                break;
            case 'experience_bias':
                imgObj = this.state.expBiasDragObj;
                imgObj.get(key).visible = false;
                this.setState({expBiasDragObj: imgObj});
                break;
            case 'voice':
                imgObj = this.state.voiceDragObj;
                imgObj.get(key).visible = false;
                this.setState({voiceDragObj: imgObj});
                break;
            case 'values':
                imgObj = this.state.valuesDragObj;
                imgObj.get(key).visible = false;
                this.setState({valuesDragObj: imgObj});
                break;
            case 'fixed_mindset':
                imgObj = this.state.fixedMindsetDragObj;
                imgObj.get(key).visible = false;
                this.setState({fixedMindsetDragObj: imgObj});
                break;
            case 'growth_mindset':
                imgObj = this.state.growthMindsetDragObj;
                imgObj.get(key).visible = false;
                this.setState({growthMindsetDragObj: imgObj});
                break;
            case 'vision':
                imgObj = this.state.visionDragObj;
                imgObj.get(key).visible = false;
                this.setState({visionDragObj: imgObj})
                break;
            case 'purpose':
                imgObj = this.state.purposeDragObj;
                imgObj.get(key).visible = false;
                this.setState({purposeDragObj: imgObj});
                break;
            case 'deliberate_practices':
                imgObj = this.state.delibPracticesDragObj;
                imgObj.get(key).visible = false;
                this.setState({delibPracticesDragObj: imgObj});
                break;
            default:
        }

        this.justDeletedIndex = key;
        this.setInfoTimer();
    }


    updateWindowDimensions() {
        this.updateDragPositions();

        var width=this.rBound/window.innerWidth;
        var height=this.bBound/window.innerHeight;
        this.setState({ rightBounds: [width, width, width, width, width, width, width, 2*width, 2*width, 5*width, width, width],
                        bottomBounds: [height, height, height, height, 2*height, 2*height, height, height, height, height, height, height] })
        this.setInfoTimer();
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        axios.get('http://localhost:9000/userinfo', {withCredentials: true})
            .then(res => {
                var data = res.data;
                if(data.netid) {
                    this.setState({loggedIn: true, canvasVisible: 'visible'})
                    this.setState({firstName: data.firstName, lastName: data.lastName, netid: data.netid, stress: data.stress,
                                   strengths: data.strengths, behaviors: data.behaviors, energy: data.energy, experience_bias: data.experience_bias,
                                   voice: data.voice, values: data.values, fixed_mindset: data.fixed_mindset, growth_mindset: data.growth_mindset,
                                   vision: data.vision, purpose: data.purpose, deliberate_practices: data.deliberate_practices});
                    var imgDrags = JSON.parse(data.imgDrags);
                    this.reconstructDbDrags(imgDrags);
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
            case 'growth_mindset':
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
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    this.handleTextChange(data, id);
                } }
                onBlur={ ( event, editor ) => {
                } }
                onFocus={ ( event, editor ) => {
                } }
                
            />
        )
    }
    
    openModal(id, gif) {
        this.setState({
            searchDialogVisibility : true,
            gifSearch: gif,
            searchDest: id,
            searchTerm: '',
            searchImgList: []
        });
    }

    closeModal() {
        this.setState({
            searchDialogVisibility : false
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

        var dbDrags = JSON.stringify(this.getDragsForDB());
        var userData = {imgDrags: dbDrags, stress: this.state.stress, strengths: this.state.strengths, behaviors: this.state.behaviors, energy: this.state.energy,
                        experience_bias: this.state.experience_bias, voice: this.state.voice, values: this.state.values, fixed_mindset: this.state.fixed_mindset,
                        growth_mindset: this.state.growth_mindset, vision: this.state.vision, purpose: this.state.purpose,
                        deliberate_practices: this.state.deliberate_practices};
        
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

    getDragsForDB() {
        var ret = [];
        ret = ret.concat(this.constructDragDBArray('stress'));
        ret = ret.concat(this.constructDragDBArray('strengths'));
        ret = ret.concat(this.constructDragDBArray('behaviors'));
        ret = ret.concat(this.constructDragDBArray('energy'));
        ret = ret.concat(this.constructDragDBArray('experience_bias'));
        ret = ret.concat(this.constructDragDBArray('voice'));
        ret = ret.concat(this.constructDragDBArray('values'));
        ret = ret.concat(this.constructDragDBArray('fixed_mindset'));
        ret = ret.concat(this.constructDragDBArray('growth_mindset'));
        ret = ret.concat(this.constructDragDBArray('vision'));
        ret = ret.concat(this.constructDragDBArray('purpose'));
        ret = ret.concat(this.constructDragDBArray('deliberate_practices'));
        return ret;
    }

    constructDragDBArray(id) {
        var dragArray;
        switch(id) {
            case 'stress':
                dragArray = [...this.state.stressDragObj.values()];
                break;
            case 'strengths':
                dragArray = [...this.state.strengthsDragObj.values()];
                break;
            case 'behaviors':
                dragArray = [...this.state.behaviorsDragObj.values()];
                break;
            case 'energy':
                dragArray = [...this.state.energyDragObj.values()];
                break;
            case 'experience_bias':
                dragArray = [...this.state.expBiasDragObj.values()];
                break;
            case 'voice':
                dragArray = [...this.state.voiceDragObj.values()];
                break;
            case 'values':
                dragArray = [...this.state.valuesDragObj.values()];
                break;
            case 'fixed_mindset':
                dragArray = [...this.state.fixedMindsetDragObj.values()];
                break;
            case 'growth_mindset':
                dragArray = [...this.state.growthMindsetDragObj.values()];
                break;
            case 'vision':
                dragArray = [...this.state.visionDragObj.values()];
                break;
            case 'purpose':
                dragArray = [...this.state.purposeDragObj.values()];
                break;
            case 'deliberate_practices':
                dragArray = [...this.state.delibPracticesDragObj.values()];
                break;
            default:
        }

        var ret = [];
        for(var i=0; i<dragArray.length; i++) {
            if(dragArray[i].visible) {
                ret.push({section: id, imgSrc: dragArray[i].imgSrc, xDensity: dragArray[i].xDensity, yDensity: dragArray[i].yDensity,
                                width: dragArray[i].width, height: dragArray[i].height, meaningText: dragArray[i].meaningText});
            }
        }
        return ret;
    }

    updateDragPositions() {
        this.loopAndUpdatePositions('stress', this.state.stressDragObj);
        this.loopAndUpdatePositions('strengths', this.state.strengthsDragObj);
        this.loopAndUpdatePositions('behaviors', this.state.behaviorsDragObj);
        this.loopAndUpdatePositions('energy', this.state.energyDragObj);
        this.loopAndUpdatePositions('experience_bias', this.state.expBiasDragObj);
        this.loopAndUpdatePositions('voice', this.state.voiceDragObj);
        this.loopAndUpdatePositions('values', this.state.valuesDragObj);
        this.loopAndUpdatePositions('fixed_mindset', this.state.fixedMindsetDragObj);
        this.loopAndUpdatePositions('growth_mindset', this.state.growthMindsetDragObj);
        this.loopAndUpdatePositions('vision', this.state.visionDragObj);
        this.loopAndUpdatePositions('purpose', this.state.purposeDragObj);
        this.loopAndUpdatePositions('deliberate_practices', this.state.delibPracticesDragObj);
    }

    loopAndUpdatePositions(id, dragMap) {
        if(dragMap != null) {
            for(var value of dragMap.values()) {
                var offsetX, offsetY;
                var xDensity = value.xDensity, yDensity = value.yDensity;
                switch(id) {
                    case 'stress':
                        offsetX = this.col1DivRef.current.offsetLeft;
                        offsetY = this.col1DivRef.current.offsetTop;
                        break;
                    case 'strengths':
                        offsetX = this.col5DivRef.current.offsetLeft;
                        offsetY = this.col5DivRef.current.offsetTop;
                        break;
                    case 'behaviors':
                        offsetX = this.col1DivRef.current.offsetLeft;
                        offsetY = this.col1DivRef.current.offsetTop + this.col1DivRef.current.offsetHeight / 2;
                        break;
                    case 'energy':
                        offsetX = this.col5DivRef.current.offsetLeft;
                        offsetY = this.col5DivRef.current.offsetTop + this.col5DivRef.current.offsetHeight / 2;
                        break;
                    case 'experience_bias':
                        offsetX = this.col2DivRef.current.offsetLeft;
                        offsetY = this.col2DivRef.current.offsetTop;
                        break;
                    case 'voice':
                        offsetX = this.col4DivRef.current.offsetLeft;
                        offsetY = this.col4DivRef.current.offsetTop;
                        break;
                    case 'values':
                        offsetX = this.bottomDivRef.current.offsetLeft;
                        offsetY = this.bottomDivRef.current.offsetTop;
                        break;
                    case 'fixed_mindset':
                        offsetX = this.col1DivRef.current.offsetLeft;
                        offsetY = this.bottomDivRef.current.offsetTop;
                        break;
                    case 'growth_mindset':
                        offsetX = this.col4DivRef.current.offsetLeft;
                        offsetY = this.bottomDivRef.current.offsetTop;
                        break;
                    case 'vision':
                        offsetX = this.topDivRef.current.offsetLeft;
                        offsetY = this.topDivRef.current.offsetTop;
                        break;
                    case 'purpose':
                        offsetX = this.col3DivRef.current.offsetLeft;
                        offsetY = this.col1DivRef.current.offsetTop + this.col3DivRef.current.offsetHeight / 2;
                        break;
                    case 'deliberate_practices':
                        offsetX = this.col3DivRef.current.offsetLeft;
                        offsetY = this.col3DivRef.current.offsetTop;
                        break;
                    default:
                }
                
                value.rndRef.updatePosition({ x: (xDensity * window.innerWidth)+offsetX, y: (yDensity * window.innerHeight)+offsetY });
            }
        }
    }

    reconstructDbDrags(imgDrags) {
        for(var i=0; i<imgDrags.length; i++) {
            var img = imgDrags[i];
            var map;
            var imgObj = this.getImgDragComp(0, img.section, this.dragIndex, img.imgSrc, img.xDensity, img.yDensity, img.width, img.height, img.meaningText);
            switch(img.section) {
                case 'stress':
                    map = this.state.stressDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({stressDragObj: map});
                    break;
                case 'strengths':
                    map = this.state.strengthsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({strengthsDragObj: map});
                    break;
                case 'behaviors':
                    map = this.state.behaviorsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({behaviorsDragObj: map});
                    break;
                case 'energy':
                    map = this.state.energyDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({energyDragObj: map});
                    break;
                case 'experience_bias':
                    map = this.state.expBiasDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({expBiasDragObj: map});
                    break;
                case 'voice':
                    map = this.state.voiceDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({voiceDragObj: map});
                    break;
                case 'values':
                    map = this.state.valuesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({valuesDragObj: map});
                    break;
                case 'fixed_mindset':
                    map = this.state.fixedMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({fixedMindsetDragObj: map});
                    break;
                case 'growth_mindset':
                    map = this.state.growthMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({growthMindsetDragObj: map});
                    break;
                case 'vision':
                    map = this.state.visionDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({visionDragObj: map});
                    break;
                case 'purpose':
                    map = this.state.purposeDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({purposeDragObj: map});
                    break;
                case 'deliberate_practices':
                    map = this.state.delibPracticesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({delibPracticesDragObj: map});
                    break;
                default:            
            }
    
            this.dragIndex++;
        }
    }

    getImgDragComp(i, searchDest, index, reconstructedSrc = 0, defXDensity = 10/window.innerWidth, defYDensity = 10/window.innerHeight, defWidth = '8vw', defHeight = '11vh', defMeaningText = '') {
        var src;
        if(!reconstructedSrc && this.state.searchImgList[i] !== 'null') {
            src = this.state.searchImgList[i];
        } else { src = reconstructedSrc; }
        var imgObj = { visible: true, imgSrc: src, dragComp: null, xDensity: defXDensity, yDensity: defYDensity, width: defWidth, height: defHeight, meaningText: defMeaningText, rndRef: null};

        imgObj.dragComp = (
            <Rnd
                bounds='parent'
                ref={c => {
                    if(index !== this.justDeletedIndex) {
                        switch(searchDest) {
                            case 'stress':
                                imgObj = this.state.stressDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({stressDragObj: imgObj});
                                break;
                            case 'strengths':
                                imgObj = this.state.strengthsDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({strengthsDragObj: imgObj});
                                break;
                            case 'behaviors':
                                imgObj = this.state.behaviorsDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({behaviorsDragObj: imgObj});
                                break;
                            case 'energy':
                                imgObj = this.state.energyDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({energyDragObj: imgObj});
                                break;
                            case 'experience_bias':
                                imgObj = this.state.expBiasDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({expBiasDragObj: imgObj});
                                break;
                            case 'voice':
                                imgObj = this.state.voiceDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({voiceDragObj: imgObj});
                                break;
                            case 'values':
                                imgObj = this.state.valuesDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({valuesDragObj: imgObj});
                                break;
                            case 'fixed_mindset':
                                imgObj = this.state.fixedMindsetDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({fixedMindsetDragObj: imgObj});
                                break;
                            case 'growth_mindset':
                                imgObj = this.state.growthMindsetDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({growthMindsetDragObj: imgObj});
                                break;
                            case 'vision':
                                imgObj = this.state.visionDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({visionDragObj: imgObj});
                                break;
                            case 'purpose':
                                imgObj = this.state.purposeDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({purposeDragObj: imgObj});
                                break;
                            case 'deliberate_practices':
                                imgObj = this.state.delibPracticesDragObj;
                                imgObj.get(index).rndRef = c;
                                this.setState({delibPracticesDragObj: imgObj});
                                break;
                            default:
                        }
                    }
                }}
                style={{display: 'flex', flexDirection: 'column'}}
                default={{
                    x: defXDensity * window.innerWidth,
                    y: defYDensity * window.innerHeight,
                    width: defWidth,
                    height: defHeight
                }}
                onDragStop={(e, d) => {
                    switch(searchDest) {
                        case 'stress':
                            imgObj = this.state.stressDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({stressDragObj: imgObj});
                            break;
                        case 'strengths':
                            imgObj = this.state.strengthsDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({strengthsDragObj: imgObj});
                            break;
                        case 'behaviors':
                            imgObj = this.state.behaviorsDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({behaviorsDragObj: imgObj});
                            break;
                        case 'energy':
                            imgObj = this.state.energyDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({energyDragObj: imgObj});
                            break;
                        case 'experience_bias':
                            imgObj = this.state.expBiasDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({expBiasDragObj: imgObj});
                            break;
                        case 'voice':                            
                            imgObj = this.state.voiceDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({voiceDragObj: imgObj});
                            break;
                        case 'values':
                            imgObj = this.state.valuesDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({valuesDragObj: imgObj});
                            break;
                        case 'fixed_mindset':
                            imgObj = this.state.fixedMindsetDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({fixedMindsetDragObj: imgObj});
                            break;
                        case 'growth_mindset':
                            imgObj = this.state.growthMindsetDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({growthMindsetDragObj: imgObj});
                            break;
                        case 'vision':
                            imgObj = this.state.visionDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({visionDragObj: imgObj});
                            break;
                        case 'purpose':
                            imgObj = this.state.purposeDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({purposeDragObj: imgObj});
                            break;
                        case 'deliberate_practices':
                            imgObj = this.state.delibPracticesDragObj;
                            imgObj.get(index).xDensity = d.x/window.innerWidth;
                            imgObj.get(index).yDensity = d.y/window.innerHeight;
                            this.setState({delibPracticesDragObj: imgObj});
                            break;
                        default:
                    }

                    this.setInfoTimer();
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    switch(searchDest) {
                        case 'stress':
                            imgObj = this.state.stressDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({stressDragObj: imgObj});
                            break;
                        case 'strengths':
                            imgObj = this.state.strengthsDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({strengthsDragObj: imgObj});
                            break;
                        case 'behaviors':
                            imgObj = this.state.behaviorsDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({behaviorsDragObj: imgObj});
                            break;
                        case 'energy':
                            imgObj = this.state.energyDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({energyDragObj: imgObj});
                            break;
                        case 'experience_bias':
                            imgObj = this.state.expBiasDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({expBiasDragObj: imgObj});
                            break;
                        case 'voice':
                            imgObj = this.state.voiceDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({voiceDragObj: imgObj});
                            break;
                        case 'values':
                            imgObj = this.state.valuesDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({valuesDragObj: imgObj});
                            break;
                        case 'fixed_mindset':
                            imgObj = this.state.fixedMindsetDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({fixedMindsetDragObj: imgObj});
                            break;
                        case 'growth_mindset':
                            imgObj = this.state.growthMindsetDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({growthMindsetDragObj: imgObj});
                            break;
                        case 'vision':
                            imgObj = this.state.visionDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({visionDragObj: imgObj});
                            break;
                        case 'purpose':
                            imgObj = this.state.purposeDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({purposeDragObj: imgObj});
                            break;
                        case 'deliberate_practices':
                            imgObj = this.state.delibPracticesDragObj;
                            imgObj.get(index).xDensity = position.x/window.innerWidth;
                            imgObj.get(index).yDensity = position.y/window.innerHeight;
                            imgObj.get(index).width = ref.offsetWidth * (100/window.innerWidth) + 'vw';
                            imgObj.get(index).height = ref.offsetHeight * (100/window.innerHeight) + 'vh';
                            this.setState({delibPracticesDragObj: imgObj});
                            break;
                        default:
                    }

                    this.setInfoTimer();
                }} >
                <button id={index} style={{padding: '10px', flex: 1, backgroundImage: 'url('+imgObj.imgSrc+')'}} onBlur={e => this.setImgBlur(e.target.id)}
                    onMouseDown={e => this.setImgFocus(e.target.id)} className='img__button' ></button>
                <TextareaAutosize defaultValue={defMeaningText} placeholder='meaning...' style={{resize: "none"}} rows={1}
                        onMouseDown={e => e.stopPropagation()} onChange={(e) => this.handleMeaningText(searchDest, index, e)}/>
            </Rnd>
        )
        return imgObj;
    }

    handleMeaningText(searchDest, index, e) {
        var imgObj;
        switch(searchDest) {
            case 'stress':
                imgObj = this.state.stressDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({stressDragObj: imgObj});
                break;
            case 'strengths':
                imgObj = this.state.strengthsDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({strengthsDragObj: imgObj});
                break;
            case 'behaviors':
                imgObj = this.state.behaviorsDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({behaviorsDragObj: imgObj});
                break;
            case 'energy':
                imgObj = this.state.energyDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({energyDragObj: imgObj});
                break;
            case 'experience_bias':
                imgObj = this.state.expBiasDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({expBiasDragObj: imgObj});
                break;
            case 'voice':
                imgObj = this.state.voiceDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({voiceDragObj: imgObj});
                break;
            case 'values':
                imgObj = this.state.valuesDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({valuesDragObj: imgObj});
                break;
            case 'fixed_mindset':
                imgObj = this.state.fixedMindsetDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({fixedMindsetDragObj: imgObj});
                break;
            case 'growth_mindset':
                imgObj = this.state.growthMindsetDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({growthMindsetDragObj: imgObj});
                break;
            case 'vision':
                imgObj = this.state.visionDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({visionDragObj: imgObj});
                break;
            case 'purpose':
                imgObj = this.state.purposeDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({purposeDragObj: imgObj});
                break;
            case 'deliberate_practices':
                imgObj = this.state.delibPracticesDragObj;
                imgObj.get(index).meaningText = e.target.value;
                this.setState({delibPracticesDragObj: imgObj});
                break;
            default:
        }

        this.setInfoTimer();
    }

    addImgDrag(searchButton) {
        var imgObj, searchDest = this.state.searchDest;
        switch(searchButton.id) {
            case 'img1':
                imgObj = this.getImgDragComp(0, searchDest, this.dragIndex);
                break;
            case 'img2':
                imgObj = this.getImgDragComp(1, searchDest, this.dragIndex);
                break;
            case 'img3':
                imgObj = this.getImgDragComp(2, searchDest, this.dragIndex);
                break;
            case 'img4':
                imgObj = this.getImgDragComp(3, searchDest, this.dragIndex);
                break;
            case 'img5':
                imgObj = this.getImgDragComp(4, searchDest, this.dragIndex);
                break;
            case 'img6':
                imgObj = this.getImgDragComp(5, searchDest, this.dragIndex);
                break;
            default:
                break;
        }
        
        var map;
        switch(searchDest) {
            case 'stress':
                map = this.state.stressDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({stressDragObj: map});
                break;
            case 'strengths':
                map = this.state.strengthsDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({strengthsDragObj: map});
                break;
            case 'behaviors':
                map = this.state.behaviorsDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({behaviorsDragObj: map});
                break;
            case 'energy':
                map = this.state.energyDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({energyDragObj: map});
                break;
            case 'experience_bias':
                map = this.state.expBiasDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({expBiasDragObj: map});
                break;
            case 'voice':
                map = this.state.voiceDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({voiceDragObj: map});
                break;
            case 'values':
                map = this.state.valuesDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({valuesDragObj: map});
                break;
            case 'fixed_mindset':
                map = this.state.fixedMindsetDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({fixedMindsetDragObj: map});
                break;
            case 'growth_mindset':
                map = this.state.growthMindsetDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({growthMindsetDragObj: map});
                break;
            case 'vision':
                map = this.state.visionDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({visionDragObj: map});
                break;
            case 'purpose':
                map = this.state.purposeDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({purposeDragObj: map});
                break;
            case 'deliberate_practices':
                map = this.state.delibPracticesDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({delibPracticesDragObj: map});
                break;
            default:            
        }

        this.dragIndex++;
        this.setInfoTimer();
    }

    setImgFocus(buttonId) {
        this.focusedId = Number(buttonId);
        this.setState({focusedOnImg: true})
    }

    setImgBlur(buttonId) {
        if(Number(buttonId) === this.focusedId) {
            this.setState({focusedOnImg: false})
        }
    }

    httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            }
        }

        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
        return;
    }

    tenorCallback_search(responsetext) {
        var response_objects = JSON.parse(responsetext);

        var top_gifs = response_objects["results"];
        for(var i=0; i<top_gifs.length; i++) {
            let a = this.state.searchImgList;
            a[i] = top_gifs[i]["media"][0]["nanogif"]["url"];
            this.setState({searchImgList: a});
        }

        if(top_gifs.length > 0) {
            this.setState({noResults: 'hidden'})
        } else {
            this.setState({noResults: 'visible'})
        }

        this.setState({searchLoaderVisibility: 'hidden'});
        return;
    }

    setGifTimer() {
        if(this.gifTimer != null) {
            clearTimeout(this.gifTimer);
        }
        if(this.pressedEnter) {
            this.gifTimer = setTimeout(this.grab_gifs.bind(this),0);
        } else {
            this.gifTimer = setTimeout(this.grab_gifs.bind(this),1000);
        }
    }
    
    grab_gifs() {
        this.setState({searchLoaderVisibility: 'visible'});
        var search_term = this.state.searchTerm;

        var imgs = ['null', 'null', 'null', 'null', 'null', 'null'];
        this.setState({searchImgList: imgs})

        var apikey = "QCI6O3ZZHMW5";
        var lmt = 6;

        var search_url = "https://api.tenor.com/v1/search?q=" + search_term + "&key=" +
                apikey + "&limit=" + lmt;

        this.httpGetAsync(search_url, this.tenorCallback_search.bind(this));

        return;
    }

    setImgTimer = () => {
        if(this.imgTimer != null) {
            clearTimeout(this.imgTimer);
        }
        if(this.pressedEnter) {
            this.imgTimer = setTimeout(this.grab_pics, 0);
        } else {
            this.imgTimer = setTimeout(this.grab_pics, 1000);
        }
    }
  
    grab_pics = () => {
        this.setState({searchLoaderVisibility: 'visible'});
        var search_term = this.state.searchTerm;

        var imgs = ['null', 'null', 'null', 'null', 'null', 'null'];
        this.setState({searchImgList: imgs})

        if(!search_term) {
            this.setState({searchLoaderVisibility: 'hidden'});
            return;
        }

        let context = this;
        $.getJSON('https://api.unsplash.com/search/photos?query='+search_term+'&per_page=10&client_id=LLxk_QhznsOac6ltGXajK5rCPUR-OX-kmzH-78kd9wM', function(data) {      
            var imageList = data.results;

            var j=0;
            $.each(imageList, function(i, val) {
                var imageURL = val.urls.small;
                var imageWidth = val.width;
                var imageHeight = val.height;
                
                if (imageWidth > imageHeight && j < 6) {
                    let a = context.state.searchImgList;
                    a[j] = imageURL;
                    context.setState({searchImgList: a});
                    j++;
                }
            });

            if(imageList.length === 0) {
                this.setState({noResults: 'visible'});
            } else {
                this.setState({noResults: 'hidden'});
            }

            context.setState({searchLoaderVisibility: 'hidden'});
        }.bind(this));
    }

    handleSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    getSearchHeader() {
        if(this.state.gifSearch) {
            return (
                <Fragment>
                    <DialogTitle>Click on a gif to add it to your canvas.</DialogTitle>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <DialogTitle>Click on an image to add it to your canvas.</DialogTitle>
                </Fragment>
            );
        }
    }

    onEnterPressImg = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.pressedEnter = true;
            this.setImgTimer();
        } else {
            this.pressedEnter = false;
        }
    }

    onEnterPressGif = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.pressedEnter = true;
            this.setGifTimer();
        }
    }

    getSearchText(context) {
        if(!this.state.gifSearch) {
            return (
                <TextField value={this.state.searchTerm} onChange={this.handleSearchChange} onKeyDown={this.onEnterPressImg} color='primary' label="Search field" type="search"/>
            )
        } else {
            return (
                <TextField value={this.state.searchTerm} onChange={this.handleSearchChange} onKeyDown={this.onEnterPressGif} color='primary' label="Search field" type="search"/>
            )
        }
    }


    render () {
        if(!this.state.loggedIn && this.state.loggedIn !== null) {
            return (
                <div>
                <MaterialNavBar loggedIn={this.state.loggedIn} title='My Canvas'/>
                <br/><br/><br/><br/><br/>
                <Grid
                container
                justify="center"
                >
                <Card variant="outlined"   direction="column" alignItems="center" justify="center" style={{maxWidth: 200}}>
                    <CardContent>
                        <Button component={ Link } to='/login' variant="outlined" color="primary">Login</Button>
                        <Typography style={{marginTop: 15}} variant='body2'>Login to access your canvas.</Typography>
                    </CardContent>
                </Card>
                </Grid>
                </div>
            );
        }
        
        return (
            <div style={{visibility: this.state.canvasVisible}}>
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.isDialogOpen}>
                    {this.getSearchHeader()}
                    <DialogContent>

                        <div style={{height: '25px'}}>
                            {this.getSearchText(this)}
                        </div>

                        <div className="grid" id="grid" style={{width: '100%'}}>
                            <br/><br/>
                            <LinearProgress color="secondary" style={{textAlign: "center", visibility: this.state.searchLoaderVisibility}}/>
                            <br/>
                                <div className="grid" style={{display: 'flex', flexDirection: 'row'}}>
                                    <div className="image"><button id="img1" style={{backgroundImage: 'url('+this.state.searchImgList[0]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                    <div style={{width: '5px'}}></div>
                                    <div className="image"><button id="img2" style={{backgroundImage: 'url('+this.state.searchImgList[1]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                    <div style={{width: '5px'}}></div>
                                    <div className="image"><button id="img3" style={{backgroundImage: 'url('+this.state.searchImgList[2]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                </div>
                                <div style={{height: '5px'}}></div>
                                <div className="grid" style={{display: 'flex', flexDirection: 'row'}}>
                                    <div className="image"><button id="img4" style={{backgroundImage: 'url('+this.state.searchImgList[3]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                    <div style={{width: '5px'}}></div>
                                    <div className="image"><button id="img5" style={{backgroundImage: 'url('+this.state.searchImgList[4]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                    <div style={{width: '5px'}}></div>
                                    <div className="image"><button id="img6" style={{backgroundImage: 'url('+this.state.searchImgList[5]+')'}} className="img__button__search" onClick={e => this.addImgDrag(e.target)}/></div>
                                </div>
                        </div>

                        <br/>

                        <DialogContentText color="textSecondary" style={{visibility: this.state.noResults}}>No results for your search.</DialogContentText>
                        
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>Close</Button>
                    </DialogContent>
                </Dialog>

                <MaterialNavBar loggedIn={this.state.loggedIn} title='My Canvas'/>

                <br/><br/><br/><br/>

                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Box
                        style={{minWidth: '0', minHeight: '0'}}
                        visibility='hidden'
                        component={Grid}
                        container
                        spacing={0}
                        direction="column"
                        >
                        <OutlinedCard style={{visibility: 'hidden'}} firstName={this.state.firstName} lastName={this.state.lastName} netid={this.state.netid}/>
                    </Box>

                    <Box
                        component={Grid}
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        >
                        <Card elevation={3} > 
                       
                        <Typography style={{margin: 35, marginBottom: 0}} variant='h5'>Try making it your own.</Typography>
                            <Typography style={{margin: 35, marginTop: 15, marginBottom: 0}} variant='body1'>You can add resizable pictures and gifs, and you can edit each text to map out your story.</Typography>
                            <br/>
                            <Typography style={{margin: 35, marginTop: 0}} color="textSecondary" variant='body2'>Your changes are automatically saved.</Typography>
                        
                        </Card>
                    </Box>
                    
                    <Box
                        component={Grid}
                        container
                        spacing={0}
                        direction="column"
                        >
                        <OutlinedCard firstName={this.state.firstName} lastName={this.state.lastName} netid={this.state.netid}/>
                    </Box>
                </div>

                <div className='canvas'>
                    <br/>
                    <Spinner className='loader' color='lightgray' style={{visibility: this.state.loaderVisibility}}/>
                    <br/>

                    <div className='canvas__top' ref={this.topDivRef}>

                        <MenuProvider id='vision_context' >
                            <this.visionContext />
                            <div className='row__long' >
                                {this.getTextCard(this.state.vision, 'vision')}        
                                { [...this.state.visionDragObj.values()].map((img, index) => [...this.state.visionDragObj.values()][index].visible &&  <Fragment key={index}>{img.dragComp}</Fragment>) }                         
                            </div>
                        </MenuProvider>

                    </div>
                    
                    <div className='canvas__middle' ref={this.middleDivRef}>

                        <div className='col__first' ref={this.col1DivRef}>

                            <MenuProvider id='stress_context' >
                                <this.stressContext />
                                <div className='col__short' style={{borderRight: 0, borderBottom: 0, borderTop: 0}} >
                                    {this.getTextCard(this.state.stress, 'stress')} 
                                    { [...this.state.stressDragObj.values()].map((img, index) => [...this.state.stressDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='behaviors_context' >
                                <this.behaviorsContext />
                                <div className='col__short' style={{borderRight: 0, borderBottom: 0, zIndex: 10}}>
                                    {this.getTextCard(this.state.behaviors, 'behaviors')} 
                                    { [...this.state.behaviorsDragObj.values()].map((img, index) => [...this.state.behaviorsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                        </div>

                        <div className='col__second' ref={this.col2DivRef}>
                            <MenuProvider id='experience_bias_context' >
                                <this.expBiasContext />
                                <div className='col__long' style={{borderTop: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.experience_bias, 'experience_bias')}
                                    { [...this.state.expBiasDragObj.values()].map((img, index) => [...this.state.expBiasDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__third' ref={this.col3DivRef}>
                            <MenuProvider id='deliberate_practices_context' >
                                <this.delibPracticesContext />
                                <div className='col__short' style={{borderRight: 0, borderLeft: 0, borderTop: 0}}>
                                    {this.getTextCard(this.state.deliberate_practices, 'deliberate_practices')}
                                    { [...this.state.delibPracticesDragObj.values()].map((img, index) => [...this.state.delibPracticesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='purpose_context' >
                                <this.purposeContext />
                                <div className='col__short' style={{borderLeft: 0, borderTop: 0, borderRight: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.purpose, 'purpose')}
                                    { [...this.state.purposeDragObj.values()].map((img, index) => [...this.state.purposeDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__fourth' ref={this.col4DivRef}>
                            <MenuProvider id='voice_context' >
                                <this.voiceContext />
                                <div className='col__long' style={{borderTop: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.voice, 'voice')}
                                    { [...this.state.voiceDragObj.values()].map((img, index) => [...this.state.voiceDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__fifth' ref={this.col5DivRef}>
                            <MenuProvider id='strengths_context' >
                                <this.strengthsContext />
                                <div className='col__short' style={{borderLeft: 0, borderBottom: 0, borderTop: 0}}>
                                    {this.getTextCard(this.state.strengths, 'strengths')} 
                                    { [...this.state.strengthsDragObj.values()].map((img, index) => [...this.state.strengthsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='energy_context' >
                                <this.energyContext />
                                <div className='col__short' style={{borderLeft: 0, borderBottom: 0}}>
                                    {this.getTextCard(this.state.energy, 'energy')}
                                    { [...this.state.energyDragObj.values()].map((img, index) => [...this.state.energyDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                    </div>

                    <div className='canvas__bottom' ref={this.bottomDivRef}>

                        <MenuProvider id='fixed_mindset_context' >
                            <this.fixedMindsetContext />
                            <div className='row__short' >
                                {this.getTextCard(this.state.fixed_mindset, 'fixed_mindset')}
                                { [...this.state.fixedMindsetDragObj.values()].map((img, index) => [...this.state.fixedMindsetDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                            </div>
                        </MenuProvider>


                        <MenuProvider id='values_context' >
                            <this.valuesContext />
                            <div className='col__short__short' style={{borderLeft: 0, borderRight: 0}}>
                                {this.getTextCard(this.state.values, 'values')}
                                { [...this.state.valuesDragObj.values()].map((img, index) => [...this.state.valuesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                            </div>
                        </MenuProvider>

                        <MenuProvider id='growth_mindset_context' >
                            <this.growthMindsetContext />
                            <div className='row__short'>
                                {this.getTextCard(this.state.growth_mindset, 'growth_mindset')}
                                { [...this.state.growthMindsetDragObj.values()].map((img, index) => [...this.state.growthMindsetDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
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
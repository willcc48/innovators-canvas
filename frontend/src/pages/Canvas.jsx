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
import {isMobile} from 'react-device-detect';
import { Link } from "@reach/router";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';
import ImageIcon from '@material-ui/icons/Image';
import GifIcon from '@material-ui/icons/Gif';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

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

            stressClass: 'col__short',
            strengthsClass: 'col__short',
            behaviorsClass: 'col__short',
            energyClass: 'col__short',
            expBiasClass: 'col__long',
            voiceClass: 'col__long',
            valuesClass: 'col__short__short',
            fixedMindsetClass: 'row__short',
            growthMindsetClass: 'row__short',
            visionClass: 'row__long',
            purposeClass: 'col__short',
            delibPracticesClass: 'col__short',

            stressMobileClass: 'section__mobile',
            strengthsMobileClass: 'section__mobile',
            behaviorsMobileClass: 'section__mobile',
            energyMobileClass: 'section__mobile',
            expBiasMobileClass: 'section__mobile',
            voiceMobileClass: 'section__mobile',
            valuesMobileClass: 'section__mobile',
            fixedMindsetMobileClass: 'section__mobile',
            growthMindsetMobileClass: 'section__mobile',
            visionMobileClass: 'section__mobile',
            purposeMobileClass: 'section__mobile',
            delibPracticesMobileClass: 'section__mobile',

            isClearDialogOpen: false,

            wizardVisible: false,
            wizardDest: '',
            editorFocused: false,
            wizardImgIndex: 0,
            wizardPrompts: ['','','','',''],
            wizardAnswers: ['','','','',''],
            wizardVisibilities: ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
            wizardVisibilitiesBoolean: [false, false, false, false, false],
            wizardVisibility5: 'hidden',
            wizardImgs: [],
            wizardImgUrlList: [],
            wizardMeanings: [],

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

        this.isSectionModified = [false, false, false, false, false, false, false, false, false, false, false, false];

        this.imgTimer = null;
        this.gifTimer = null;
        this.infoTimer = null;
        this.updateInfo = this.updateInfo.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.pressedEnter = false;

        this.stressEditor = null;
        this.strengthsEditor = null;
        this.behaviorsEditor = null;
        this.energyEditor = null;
        this.expBiasEditor = null;
        this.voiceEditor = null;
        this.valuesEditor = null;
        this.fixedMindsetEditor = null;
        this.growthMindsetEditor = null;
        this.visionEditor = null;
        this.purposeEditor = null;
        this.delibPracticesEditor = null;

        if(!isMobile) {
            this.editorConfiguration = {
                placeholder: 'Enter text here...',
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
        } else {
            this.editorConfiguration = {
                placeholder: 'Enter text here...',
                toolbar: [
                    'bold',
                    'italic',
                    'bulletedList',
                    '|',
                    'fontSize',
                    'fontFamily',
                    '|',
                    'heading',
                ]
            };
        }
        

        this.handleClickOpen = (id, gif) => {

            this.setState({
                noResults: 'hidden',
                isDialogOpen: true,
                gifSearch: gif,
                wizardSearch: false,
                searchDest: id,
                searchTerm: '',
                searchImgList: []
            });
        };

        this.handleWizardImage = () => {
            this.setWizardSearchDest();
            this.setState({
                noResults: 'hidden',
                isDialogOpen: true,
                gifSearch: false,
                wizardSearch: true,
                searchTerm: '',
                searchImgList: []
            });
        };

        this.handleWizardGif = () => {
            this.setWizardSearchDest();
            this.setState({
                noResults: 'hidden',
                isDialogOpen: true,
                gifSearch: true,
                wizardSearch: true,
                searchTerm: '',
                searchImgList: []
            });
        };

        this.handleClose = () => {
            this.setState({isDialogOpen: false});
        };

        this.handleCloseWizardDialog = () => {
            this.setState({wizardVisible: false});
        };
        this.handleWizardDoneDialog = () => {
            this.wizardUpdateTextandDrags();
            this.setState({wizardVisible: false});
        };
        this.wizardChange1 = (data) => {
            var answers = this.state.wizardAnswers;
            answers[0] = data;
            this.setState({wizardAnswers: answers});
        };
        this.wizardChange2 = (data) => {
            var answers = this.state.wizardAnswers;
            answers[1] = data;
            this.setState({wizardAnswers: answers});
        };
        this.wizardChange3 = (data) => {
            var answers = this.state.wizardAnswers;
            answers[2] = data;
            this.setState({wizardAnswers: answers});
        };
        this.wizardChange4 = (data) => {
            var answers = this.state.wizardAnswers;
            answers[3] = data;
            this.setState({wizardAnswers: answers});
        };
        this.wizardChange5 = (data) => {
            var answers = this.state.wizardAnswers;
            answers[4] = data;
            this.setState({wizardAnswers: answers});
        };

        this.handleCloseClearDialog = () => {
            this.setState({isClearDialogOpen: false});
        };

        this.handleClearSection = () => {
            this.setState({isClearDialogOpen: false});
            var imgObj;
            switch(this.state.sectionToClear) {
                case 'stress':
                    this.isSectionModified[0] = false;
                    imgObj = this.state.stressDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({stressDragObj: imgObj, stressClass: 'col__short', stressMobileClass: 'section__mobile'});
                    this.stressEditor.setData('<h3>Stress</h3>');
                    break;
                case 'strengths':
                    this.isSectionModified[1] = false;
                    imgObj = this.state.strengthsDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({strengthsDragObj: imgObj, strengthsClass: 'col__short', strengthsMobileClass: 'section__mobile'});
                    this.strengthsEditor.setData('<h3>Strengths</h3>');
                    break;
                case 'behaviors':
                    this.isSectionModified[2] = false;
                    imgObj = this.state.behaviorsDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({behaviorsDragObj: imgObj, behaviorsClass: 'col__short', behaviorsMobileClass: 'section__mobile'});
                    this.behaviorsEditor.setData('<h3>Behaviors</h3>');
                    break;
                case 'energy':
                    this.isSectionModified[3] = false;
                    imgObj = this.state.energyDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({energyDragObj: imgObj, energyClass: 'col__short', energyMobileClass: 'section__mobile'});
                    this.energyEditor.setData('<h3>Energy</h3>');
                    break;
                case 'experience_bias':
                    this.isSectionModified[4] = false;
                    imgObj = this.state.expBiasDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({expBiasDragObj: imgObj, expBiasClass: 'col__long', expBiasMobileClass: 'section__mobile'});
                    this.expBiasEditor.setData('<h3>Experience Bias</h3>');
                    break;
                case 'voice':
                    this.isSectionModified[5] = false;
                    imgObj = this.state.voiceDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({voiceDragObj: imgObj, voiceClass: 'col__long', voiceMobileClass: 'section__mobile'});
                    this.voiceEditor.setData('<h3>Voice</h3>');
                    break;
                case 'values':
                    this.isSectionModified[6] = false;
                    imgObj = this.state.valuesDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({valuesDragObj: imgObj, valuesClass: 'col__short__short', valuesMobileClass: 'section__mobile'});
                    this.valuesEditor.setData('<h3>Values</h3>');
                    break;
                case 'fixed_mindset':
                    this.isSectionModified[7] = false;
                    imgObj = this.state.fixedMindsetDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({fixedMindsetDragObj: imgObj, fixedMindsetClass: 'row__short', fixedMindsetMobileClass: 'section__mobile'});
                    this.fixedMindsetEditor.setData('<h3>Fixed Mindset</h3>');
                    break;
                case 'growth_mindset':
                    this.isSectionModified[8] = false;
                    imgObj = this.state.growthMindsetDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({growthMindsetDragObj: imgObj, growthMindsetClass: 'row__short', growthMindsetMobileClass: 'section__mobile'});
                    this.growthMindsetEditor.setData('<h3>Growth Mindset</h3>');
                    break;
                case 'vision':
                    this.isSectionModified[9] = false;
                    imgObj = this.state.visionDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({visionDragObj: imgObj, visionClass: 'row__long', visionMobileClass: 'section__mobile'})
                    this.visionEditor.setData('<h3>Vision</h3>');
                    break;
                case 'purpose':
                    this.isSectionModified[10] = false;
                    imgObj = this.state.purposeDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({purposeDragObj: imgObj, purposeClass: 'col__short', purposeMobileClass: 'section__mobile'});
                    this.purposeEditor.setData('<h3>Purpose</h3>');
                    break;
                case 'deliberate_practices':
                    this.isSectionModified[11] = false;
                    imgObj = this.state.delibPracticesDragObj;
                    for(const key of imgObj.keys()) { imgObj.get(key).visible = false; }
                    this.setState({delibPracticesDragObj: imgObj, delibPracticesClass: 'col__short', delibPracticesMobileClass: 'section__mobile'});
                    this.delibPracticesEditor.setData('<h3>Deliberate Practices</h3>');
                    break;
                default:
            }
            this.setInfoTimer();
        };

        this.onImageClick = (id) => this.handleClickOpen(id, false);
        this.onGifClick = (id) => this.handleClickOpen(id, true);

        this.wizardImageClick = () => this.handleWizardImage();
        this.wizardGifClick = () => this.handleWizardGif();

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
            <Item onClick={() => this.clearSection(id)}>Reset Section</Item>
            </Menu>
        );
    }

    clearSection(id) {
        this.setState({isClearDialogOpen: true, sectionToClear: id});
    }

    deleteImage(id) {
        var key = this.focusedId;
        var imgObj, flag, value;
        switch(id) {
            case 'stress':
                imgObj = this.state.stressDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.stressDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[0] = false; this.setState({stressDragObj: imgObj, stressClass: 'col__short', stressMobileClass: 'section__mobile'}); }
                else { this.setState({stressDragObj: imgObj}); }
                break;
            case 'strengths':
                imgObj = this.state.strengthsDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.strengthsDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[1] = false; this.setState({strengthsDragObj: imgObj, strengthsClass: 'col__short', strengthsMobileClass: 'section__mobile'}); }
                else { this.setState({strengthsDragObj: imgObj}); }
                break;
            case 'behaviors':
                imgObj = this.state.behaviorsDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.behaviorsDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[2] = false; this.setState({behaviorsDragObj: imgObj, behaviorsClass: 'col__short', behaviorsMobileClass: 'section__mobile'}); }
                else { this.setState({behaviorsDragObj: imgObj}); }
                break;
            case 'energy':
                imgObj = this.state.energyDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.energyDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[3] = false; this.setState({energyDragObj: imgObj, energyClass: 'col__short', energyMobileClass: 'section__mobile'}); }
                else { this.setState({energyDragObj: imgObj}); }
                break;
            case 'experience_bias':
                imgObj = this.state.expBiasDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.expBiasDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[4] = false; this.setState({expBiasDragObj: imgObj, expBiasClass: 'col__long', expBiasMobileClass: 'section__mobile'}); }
                else { this.setState({expBiasDragObj: imgObj}); }
                break;
            case 'voice':
                imgObj = this.state.voiceDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.voiceDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[5] = false; this.setState({voiceDragObj: imgObj, voiceClass: 'col__long', voiceMobileClass: 'section__mobile'}); }
                else { this.setState({voiceDragObj: imgObj}); }
                break;
            case 'values':
                imgObj = this.state.valuesDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.valuesDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[6] = false; this.setState({valuesDragObj: imgObj, valuesClass: 'col__short__short', valuesMobileClass: 'section__mobile'}); }
                else { this.setState({valuesDragObj: imgObj}); }
                break;
            case 'fixed_mindset':
                imgObj = this.state.fixedMindsetDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.fixedMindsetDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[7] = false; this.setState({fixedMindsetDragObj: imgObj, fixedMindsetClass: 'row__short', fixedMindsetMobileClass: 'section__mobile'}); }
                else { this.setState({fixedMindsetDragObj: imgObj}); }
                break;
            case 'growth_mindset':
                imgObj = this.state.growthMindsetDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.growthMindsetDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[8] = false; this.setState({growthMindsetDragObj: imgObj, growthMindsetClass: 'row__short', growthMindsetMobileClass: 'section__mobile'}); }
                else { this.setState({growthMindsetDragObj: imgObj}); }
                break;
            case 'vision':
                imgObj = this.state.visionDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.visionDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[9] = false; this.setState({visionDragObj: imgObj, visionClass: 'row__long', visionMobileClass: 'section__mobile'}); }
                else { this.setState({visionDragObj: imgObj}); }
                break;
            case 'purpose':
                imgObj = this.state.purposeDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.purposeDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[10] = false; this.setState({purposeDragObj: imgObj, purposeClass: 'col__short', purposeMobileClass: 'section__mobile'}); }
                else { this.setState({purposeDragObj: imgObj}); }
                break;
            case 'deliberate_practices':
                imgObj = this.state.delibPracticesDragObj;
                imgObj.get(key).visible = false;
                flag = false;
                for(value of this.state.delibPracticesDragObj.values()) { if(value.visible) { flag = true; } }
                if(!flag) { this.isSectionModified[11] = false; this.setState({delibPracticesDragObj: imgObj, delibPracticesClass: 'col__short', delibPracticesMobileClass: 'section__mobile'}); }
                else { this.setState({delibPracticesDragObj: imgObj}); }
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
        var flag, val;
        switch(id) {
            case 'stress':
                flag = false;
                for(val of this.state.stressDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Stress</h3>' && !flag) { this.isSectionModified[0] = false; this.setState({stressClass: 'col__short', stressMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[0] = true; this.setState({stressClass: 'col__short__nohover', stressMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'strengths':
                flag = false;
                for(val of this.state.strengthsDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Strengths</h3>' && !flag) { this.isSectionModified[1] = false; this.setState({strengthsClass: 'col__short', strengthsMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[1] = true;this.setState({strengthsClass: 'col__short__nohover', strengthsMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'behaviors':
                flag = false;
                for(val of this.state.behaviorsDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Behaviors</h3>' && !flag) { this.isSectionModified[2] = false; this.setState({behaviorsClass: 'col__short', behaviorsMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[2] = true;this.setState({behaviorsClass: 'col__short__nohover', behaviorsMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'energy':
                flag = false;
                for(val of this.state.energyDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Energy</h3>' && !flag) { this.isSectionModified[3] = false; this.setState({energyClass: 'col__short', energyMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[3] = true;this.setState({energyClass: 'col__short__nohover', energyMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'experience_bias':
                flag = false;
                for(val of this.state.expBiasDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Experience Bias</h3>' && !flag) { this.isSectionModified[4] = false; this.setState({expBiasClass: 'col__long', expBiasMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[4] = true;this.setState({expBiasClass: 'col__long__nohover', expBiasMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'voice':
                flag = false;
                for(val of this.state.voiceDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Voice</h3>' && !flag) { this.isSectionModified[5] = false; this.setState({voiceClass: 'col__long', voiceMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[5] = true;this.setState({voiceClass: 'col__long__nohover', voiceMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'values':
                flag = false;
                for(val of this.state.valuesDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Values</h3>' && !flag) { this.isSectionModified[6] = false; this.setState({valuesClass: 'col__short__short', valuesMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[6] = true;this.setState({valuesClass: 'col__short__short__nohover', valuesMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'fixed_mindset':
                flag = false;
                for(val of this.state.fixedMindsetDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Fixed Mindset</h3>' && !flag) { this.isSectionModified[7] = false; this.setState({fixedMindsetClass: 'row__short', fixedMindsetMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[7] = true;this.setState({fixedMindsetClass: 'row__short__nohover', fixedMindsetMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'growth_mindset':
                flag = false;
                for(val of this.state.growthMindsetDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Growth Mindset</h3>' && !flag) { this.isSectionModified[8] = false; this.setState({growthMindsetClass: 'row__short', growthMindsetMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[8] = true;this.setState({growthMindsetClass: 'row__short__nohover', growthMindsetMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'vision':
                flag = false;
                for(val of this.state.visionDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Vision</h3>' && !flag) { this.isSectionModified[9] = false; this.setState({visionClass: 'row__long', visionMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[9] = true; this.setState({visionClass: 'row__long__nohover', visionMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'purpose':
                flag = false;
                for(val of this.state.purposeDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Purpose</h3>' && !flag) { this.isSectionModified[10] = false; this.setState({purposeClass: 'col__short', purposeMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[10] = true;this.setState({purposeClass: 'col__short__nohover', purposeMobileClass: 'section__mobile__nohover'}); }
                break;
            case 'deliberate_practices':
                flag = false;
                for(val of this.state.delibPracticesDragObj.values()) { if(val.visible) { flag = true; } }
                if(value === '<h3>Deliberate Practices</h3>' && !flag) { this.isSectionModified[11] = false; this.setState({delibPracticesClass: 'col__short', delibPracticesMobileClass: 'section__mobile'}); }
                else { this.isSectionModified[11] = true;this.setState({delibPracticesClass: 'col__short__nohover', delibPracticesMobileClass: 'section__mobile__nohover'}); }
                break;
            default:            
        }

        this.setInfoTimer();
    }

    getTextCard(text, id) {
        return (
            <CKEditor
                disabled={ isMobile }
                editor={ BalloonEditor }
                config={ this.editorConfiguration }
                data={ text }
                onInit={ editor => {
                    switch(id) {
                        case 'stress':
                            this.stressEditor = editor;
                            break;
                        case 'strengths':
                            this.strengthsEditor = editor;
                            break;
                        case 'behaviors':
                            this.behaviorsEditor = editor;
                            break;
                        case 'energy':
                            this.energyEditor = editor;
                            break;
                        case 'experience_bias':
                            this.expBiasEditor = editor;
                            break;
                        case 'voice':
                            this.voiceEditor = editor;
                            break;
                        case 'values':
                            this.valuesEditor = editor;
                            break;
                        case 'fixed_mindset':
                            this.fixedMindsetEditor = editor;
                            break;
                        case 'growth_mindset':
                            this.growthMindsetEditor = editor;
                            break;
                        case 'vision':
                            this.visionEditor = editor;
                            break;
                        case 'purpose':
                            this.purposeEditor = editor;
                            break;
                        case 'deliberate_practices':
                            this.delibPracticesEditor = editor;
                            break;
                        default:            
                    }
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    this.handleTextChange(data, id);
                } }
                onBlur={ ( event, editor ) => {
                    this.setState({editorFocused: false})
                } }
                onFocus={ ( event, editor ) => {
                    this.setState({editorFocused: true})
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
        var userData = {imgDrags: dbDrags, stress: this.stressEditor.getData(), strengths: this.strengthsEditor.getData(), behaviors: this.behaviorsEditor.getData(), energy: this.energyEditor.getData(),
                        experience_bias: this.expBiasEditor.getData(), voice: this.voiceEditor.getData(), values: this.valuesEditor.getData(), fixed_mindset: this.fixedMindsetEditor.getData(),
                        growth_mindset: this.growthMindsetEditor.getData(), vision: this.visionEditor.getData(), purpose: this.purposeEditor.getData(),
                        deliberate_practices: this.delibPracticesEditor.getData()};
    
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
                ret.push({section: id, imgSrc: dragArray[i].imgSrc, meaningText: dragArray[i].meaningText, xDensity: dragArray[i].xDensity, yDensity: dragArray[i].yDensity,
                    width: dragArray[i].width, height: dragArray[i].height, mobile: isMobile});
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
        if(dragMap != null && !isMobile) {
            for(var value of dragMap.values()) {
                var offsetX = 0, offsetY = 0;
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

    wizardUpdateTextandDrags() {
        var ogText, newText;
        switch(this.state.wizardDest) {
            case 'Stress':
                ogText = this.stressEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2];
                this.stressEditor.setData(newText);
                break;
            case 'Strengths':
                ogText = this.strengthsEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1];
                this.strengthsEditor.setData(newText);
                break;
            case 'Behaviors':
                ogText = this.behaviorsEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2];
                this.behaviorsEditor.setData(newText);
                break;
            case 'Energy':
                ogText = this.energyEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1];
                this.energyEditor.setData(newText);
                break;
            case 'Experience Bias':
                ogText = this.expBiasEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2];
                this.expBiasEditor.setData(newText);
                break;
            case 'Voice':
                ogText = this.voiceEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2];
                this.voiceEditor.setData(newText);
                break;
            case 'Values':
                ogText = this.valuesEditor.getData();
                newText = ogText + this.state.wizardAnswers[0];
                this.valuesEditor.setData(newText);
                break;
            case 'Fixed Mindset':
                ogText = this.fixedMindsetEditor.getData();
                newText = ogText + this.state.wizardAnswers[0];
                this.fixedMindsetEditor.setData(newText);
                break;
            case 'Growth Mindset':
                ogText = this.growthMindsetEditor.getData();
                newText = ogText + this.state.wizardAnswers[0];
                this.growthMindsetEditor.setData(newText);
                break;
            case 'Vision':
                ogText = this.visionEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2]+this.state.wizardAnswers[3]+this.state.wizardAnswers[4];
                this.visionEditor.setData(newText);
                break;
            case 'Purpose':
                ogText = this.purposeEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2]+this.state.wizardAnswers[3]+this.state.wizardAnswers[4];
                this.purposeEditor.setData(newText);
                break;
            case 'Deliberate Practices':
                ogText = this.delibPracticesEditor.getData();
                newText = ogText + this.state.wizardAnswers[0]+this.state.wizardAnswers[1]+this.state.wizardAnswers[2]+this.state.wizardAnswers[3]+this.state.wizardAnswers[4];
                this.delibPracticesEditor.setData(newText);
                break;
            default:
        }

        for(var i=0; i<this.state.wizardImgUrlList.length; i++) {
            var map;
            console.log(this.state.wizardMeanings);
            var imgObj = this.getImgDragComp(-1, this.state.searchDest, this.dragIndex, this.state.wizardImgUrlList[i], this.state.wizardMeanings[i]);
            switch(this.state.wizardDest) {
                case 'Stress':
                    this.isSectionModified[0] = true;
                    map = this.state.stressDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({stressDragObj: map, stressClass: 'col__short__nohover', stressMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Strengths':
                    this.isSectionModified[1] = true;
                    map = this.state.strengthsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({strengthsDragObj: map, strengthsClass: 'col__short__nohover', strengthsMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Behaviors':
                    this.isSectionModified[2] = true;
                    map = this.state.behaviorsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({behaviorsDragObj: map, behaviorsClass: 'col__short__nohover', behaviorsMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Energy':
                    this.isSectionModified[3] = true;
                    map = this.state.energyDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({energyDragObj: map, energyClass: 'col__short__nohover', energyMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Experience Bias':
                    this.isSectionModified[4] = true;
                    map = this.state.expBiasDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({expBiasDragObj: map, expBiasClass: 'col__long__nohover', expBiasMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Voice':
                    this.isSectionModified[5] = true;
                    map = this.state.voiceDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({voiceDragObj: map, voiceClass: 'col__long__nohover', voiceMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Values':
                    this.isSectionModified[6] = true;
                    map = this.state.valuesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({valuesDragObj: map, valuesClass: 'col__short__short__nohover', valuesMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Fixed Mindset':
                    this.isSectionModified[7] = true;
                    map = this.state.fixedMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({fixedMindsetDragObj: map, fixedMindsetClass: 'row__short__nohover', fixedMindsetMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Growth Mindset':
                    this.isSectionModified[8] = true;
                    map = this.state.growthMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({growthMindsetDragObj: map, growthMindsetClass: 'row__short__nohover', growthMindsetMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Vision':
                    this.isSectionModified[9] = true;
                    map = this.state.visionDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({visionDragObj: map, visionClass: 'row__long__nohover', visionMobileClass: 'section__mobile__nohover'});
                    break;
                case 'Purpose':
                    this.isSectionModified[10] = true;
                    map = this.state.purposeDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({purposeDragObj: map, purposeClass: 'col__short__nohover', purposeMobileClass: 'col__short__nohover'});
                    break;
                case 'Deliberate Practices':
                    this.isSectionModified[11] = true;
                    map = this.state.delibPracticesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({delibPracticesDragObj: map, delibPracticesClass: 'col__short__nohover', delibPracticesMobileClass: 'col__short__nohover'});
                    break;
                default:            
            }
            this.dragIndex++;
        }

        this.setInfoTimer();
    }

    reconstructDbDrags(imgDrags) {
        for(var i=0; i<imgDrags.length; i++) {
            var img = imgDrags[i];
            var map;
            var xDens = img.xDensity, yDens = img.yDensity, width = img.width, height = img.height;
            if(img.mobile && !isMobile) {
                width = parseInt(width.split('v')[0]);
                height = parseInt(height.split('v')[0]);
                switch(img.section) {
                    case 'stress':
                        break;
                    case 'strengths':
                        
                        break;
                    case 'behaviors':
                        
                        break;
                    case 'energy':
                        
                        break;
                    case 'experience_bias':
                        
                        break;
                    case 'voice':
                        
                        break;
                    case 'values':
                        
                        break;
                    case 'fixed_mindset':
                        
                        break;
                    case 'growth_mindset':
                        
                        break;
                    case 'vision':
                        
                        break;
                    case 'purpose':
                        
                        break;
                    case 'deliberate_practices':
                        
                        break;
                    default:
                }
            }
            else if(!img.mobile && isMobile) {

            }
            var imgObj = this.getImgDragComp(-1, img.section, this.dragIndex, img.imgSrc, img.meaningText, xDens, yDens, width, height);
            switch(img.section) {
                case 'stress':
                    this.isSectionModified[0] = true;
                    map = this.state.stressDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({stressDragObj: map, stressClass: 'col__short__nohover', stressMobileClass: 'section__mobile__nohover'});
                    break;
                case 'strengths':
                    this.isSectionModified[1] = true;
                    map = this.state.strengthsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({strengthsDragObj: map, strengthsClass: 'col__short__nohover', strengthsMobileClass: 'section__mobile__nohover'});
                    break;
                case 'behaviors':
                    this.isSectionModified[2] = true;
                    map = this.state.behaviorsDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({behaviorsDragObj: map, behaviorsClass: 'col__short__nohover', behaviorsMobileClass: 'section__mobile__nohover'});
                    break;
                case 'energy':
                    this.isSectionModified[3] = true;
                    map = this.state.energyDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({energyDragObj: map, energyClass: 'col__short__nohover', energyMobileClass: 'section__mobile__nohover'});
                    break;
                case 'experience_bias':
                    this.isSectionModified[4] = true;
                    map = this.state.expBiasDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({expBiasDragObj: map, expBiasClass: 'col__long__nohover', expBiasMobileClass: 'section__mobile__nohover'});
                    break;
                case 'voice':
                    this.isSectionModified[5] = true;
                    map = this.state.voiceDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({voiceDragObj: map, voiceClass: 'col__long__nohover', voiceMobileClass: 'section__mobile__nohover'});
                    break;
                case 'values':
                    this.isSectionModified[6] = true;
                    map = this.state.valuesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({valuesDragObj: map, valuesClass: 'col__short__short__nohover', valuesMobileClass: 'section__mobile__nohover'});
                    break;
                case 'fixed_mindset':
                    this.isSectionModified[7] = true;
                    map = this.state.fixedMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({fixedMindsetDragObj: map, fixedMindsetClass: 'row__short__nohover', fixedMindsetMobileClass: 'section__mobile__nohover'});
                    break;
                case 'growth_mindset':
                    this.isSectionModified[8] = true;
                    map = this.state.growthMindsetDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({growthMindsetDragObj: map, growthMindsetClass: 'row__short__nohover', growthMindsetMobileClass: 'section__mobile__nohover'});
                    break;
                case 'vision':
                    this.isSectionModified[9] = true;
                    map = this.state.visionDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({visionDragObj: map, visionClass: 'row__long__nohover', visionMobileClass: 'section__mobile__nohover'});
                    break;
                case 'purpose':
                    this.isSectionModified[10] = true;
                    map = this.state.purposeDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({purposeDragObj: map, purposeClass: 'col__short__nohover', purposeMobileClass: 'section__mobile__nohover'});
                    break;
                case 'deliberate_practices':
                    this.isSectionModified[11] = true;
                    map = this.state.delibPracticesDragObj;
                    map.set(this.dragIndex, imgObj);
                    this.setState({delibPracticesDragObj: map, delibPracticesClass: 'col__short__nohover', delibPracticesMobileClass: 'section__mobile__nohover'});
                    break;
                default:            
            }
            this.dragIndex++;
            this.setInfoTimer();
        }
    }

    getImgDragComp(i, searchDest, index, reconstructedSrc = 0, defMeaningText = '', defXDensity = 10/window.innerWidth, defYDensity = 10/window.innerHeight, defWidth = '8vw', defHeight = '11vh') {
        var src;
        if(!reconstructedSrc && this.state.searchImgList[i] !== 'null') {
            src = this.state.searchImgList[i];
            if(isMobile) {
                defWidth = '27vw';
                defHeight = '12vh'
            }
        } else { src = reconstructedSrc; }
        
        var imgObj = { visible: true, imgSrc: src, dragComp: null, meaningText: defMeaningText, xDensity: defXDensity, yDensity: defYDensity, width: defWidth, height: defHeight, rndRef: null};

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

        var imgSearchIndex, searchDest = this.state.searchDest;
        switch(searchButton.id) {
            case 'img1':
                imgSearchIndex = 0;
                break;
            case 'img2':
                imgSearchIndex = 1;
                break;
            case 'img3':
                imgSearchIndex = 2;
                break;
            case 'img4':
                imgSearchIndex = 3;
                break;
            case 'img5':
                imgSearchIndex = 4;
                break;
            case 'img6':
                imgSearchIndex = 5;
                break;
            default:
                break;
        }

        if(this.state.wizardSearch) {
            var arr1 = this.state.wizardImgUrlList;
            arr1.push(this.state.searchImgList[imgSearchIndex]);
            this.setState({wizardImgUrlList: arr1});

            var index = this.state.wizardImgIndex;

            var arr2 = this.state.wizardImgs;
            arr2.push(
                <Grid item xs={4} >
                    <div style={{display: 'flex', flexDirection: 'column'}} className="image">
                        <button style={{padding: '10px', flex: 1, cursor: 'default', backgroundImage: 'url('+this.state.searchImgList[imgSearchIndex]+')'}} className="img__button__search" />
                        <TextareaAutosize placeholder='meaning...' style={{resize: "none"}} rows={1} onChange={(e) => this.handleWizardMeaningText(index, e)} />
                    </div>
                </Grid>
            );
            console.log(this.state.wizardMeanings);

            this.setState({wizardImgs: arr2, wizardImgIndex: this.state.wizardImgIndex+1});
            return;
        }

        var imgObj = this.getImgDragComp(imgSearchIndex, searchDest, this.dragIndex);

        var map;
        switch(searchDest) {
            case 'stress':
                this.isSectionModified[0] = true;
                map = this.state.stressDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({stressDragObj: map, stressClass: 'col__short__nohover', stressMobileClass: 'section__mobile__nohover'});
                break;
            case 'strengths':
                this.isSectionModified[1] = true;
                map = this.state.strengthsDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({strengthsDragObj: map, strengthsClass: 'col__short__nohover', strengthsMobileClass: 'section__mobile__nohover'});
                break;
            case 'behaviors':
                this.isSectionModified[2] = true;
                map = this.state.behaviorsDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({behaviorsDragObj: map, behaviorsClass: 'col__short__nohover', behaviorsMobileClass: 'section__mobile__nohover'});
                break;
            case 'energy':
                this.isSectionModified[3] = true;
                map = this.state.energyDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({energyDragObj: map, energyClass: 'col__short__nohover', energyMobileClass: 'section__mobile__nohover'});
                break;
            case 'experience_bias':
                this.isSectionModified[4] = true;
                map = this.state.expBiasDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({expBiasDragObj: map, expBiasClass: 'col__long__nohover', expBiasMobileClass: 'section__mobile__nohover'});
                break;
            case 'voice':
                this.isSectionModified[5] = true;
                map = this.state.voiceDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({voiceDragObj: map, voiceClass: 'col__long__nohover', voiceMobileClass: 'section__mobile__nohover'});
                break;
            case 'values':
                this.isSectionModified[6] = true;
                map = this.state.valuesDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({valuesDragObj: map, valuesClass: 'col__short__short__nohover', valuesMobileClass: 'section__mobile__nohover'});
                break;
            case 'fixed_mindset':
                this.isSectionModified[7] = true;
                map = this.state.fixedMindsetDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({fixedMindsetDragObj: map, fixedMindsetClass: 'row__short__nohover', fixedMindsetMobileClass: 'section__mobile__nohover'});
                break;
            case 'growth_mindset':
                this.isSectionModified[8] = true;
                map = this.state.growthMindsetDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({growthMindsetDragObj: map, growthMindsetClass: 'row__short__nohover', growthMindsetMobileClass: 'section__mobile__nohover'});
                break;
            case 'vision':
                this.isSectionModified[9] = true;
                map = this.state.visionDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({visionDragObj: map, visionClass: 'row__long__nohover', visionMobileClass: 'section__mobile__nohover'});
                break;
            case 'purpose':
                this.isSectionModified[10] = true;
                map = this.state.purposeDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({purposeDragObj: map, purposeClass: 'col__short__nohover', purposeMobileClass: 'section__mobile__nohover'});
                break;
            case 'deliberate_practices':
                this.isSectionModified[11] = true;
                map = this.state.delibPracticesDragObj;
                map.set(this.dragIndex, imgObj);
                this.setState({delibPracticesDragObj: map, delibPracticesClass: 'col__short__nohover', delibPracticesMobileClass: 'section__mobile__nohover'});
                break;
            default:            
        }

        this.dragIndex++;
        this.setInfoTimer();
    }

    handleWizardMeaningText(index, e) {
        console.log(index);
        var arr = this.state.wizardMeanings;
        arr[index] = e.target.value;
        this.setState({wizardMeanings: arr});
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

    setWizardSearchDest() {
        switch(this.state.wizardDest) {
            case 'Stress':
                this.setState({searchDest: 'stress'});
                break;
            case 'Strengths':
                this.setState({searchDest: 'strengths'});
                break;
            case 'Behaviors':
                this.setState({searchDest: 'behaviors'});
                break;
            case 'Energy':
                this.setState({searchDest: 'energy'});
                break;
            case 'Experience Bias':
                this.setState({searchDest: 'experience_bias'});
                break;
            case 'Voice':
                this.setState({searchDest: 'voice'});
                break;
            case 'Values':
                this.setState({searchDest: 'values'});
                break;
            case 'Fixed Mindset':
                this.setState({searchDest: 'fixed_mindset'});
                break;
            case 'Growth Mindset':
                this.setState({searchDest: 'growth_mindset'});
                break;
            case 'Vision':
                this.setState({searchDest: 'vision'});
                break;
            case 'Purpose':
                this.setState({searchDest: 'purpose'});
                break;
            case 'Deliberate Practices':
                this.setState({searchDest: 'deliberate_practices'});
                break;
            default:            
        }
    }

    showWizard(id) {
        if(this.state.editorFocused) { return; }
        this.setState({wizardAnswers: ['','','','',''], wizardImgs: []});
        var prompts=[], visibilities = ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'], visibilitiesBoolean = [false, false, false, false, false];
        switch(id) {
            case 'stress':
                if(!this.isSectionModified[0]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Stress'});
                    prompts = ['What are your sources of stress?', 'What situations cause stress for you?', 'When are you most uncomfortable?'];
                }
                break;
            case 'strengths':
                if(!this.isSectionModified[1]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Strengths'});
                    prompts = ['Where do you draw your strength?', 'What are you great at?'];
                }
                break;
            case 'behaviors':
                if(!this.isSectionModified[2]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Behaviors'});
                    prompts = ['Are there ways you always do things?', 'Note any patterns in your work or social life.', 'Are there things that “keep happening” in your life?'];
                }
                break;
            case 'energy':
                if(!this.isSectionModified[3]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Energy'});
                    prompts = ['How do you recharge when you are rundown?', 'What helps you deal with stress?'];
                }
                break;
            case 'experience_bias':
                if(!this.isSectionModified[4]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Experience Bias'});
                    prompts = ['How have your lived experiences shaped your worldview?', 'What situations do you find yourself generalizing your lived experience to others’?', 'When have your behaviors or thought patterns led to misunderstanding, conflict, or failure?'];
                }
                break;
            case 'voice':
                if(!this.isSectionModified[5]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Voice'});
                    prompts = ['What is different about how you view the world?', 'How do you describe your worldview to others?', 'What is it like to work with you on something?'];
                }
                break;
            case 'values':
                if(!this.isSectionModified[6]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Values'});
                    prompts = ['What principles are important and influence how you live your life?'];
                }
                break;
            case 'fixed_mindset':
                if(!this.isSectionModified[7]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Fixed Mindset'});
                    prompts = ['What areas of your life do you feel that you can’t or don’t need to change?'];
                }
                break;
            case 'growth_mindset':
                if(!this.isSectionModified[8]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Growth Mindset'});
                    prompts = ['What areas of your life are you open to learning and adapting?'];
                }
                break;
            case 'vision':
                if(!this.isSectionModified[9]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Vision'});
                    prompts = ['What do you want to create?', 'What impact do you want to make?', 'Encapsulate everything you would like to be, do, and have.', 'Define what success and excellence look like to you.', 'Express where you want to be in the future. It  should reflect your values, goals, purpose, and how you operate.'];
                }
                break;
            case 'purpose':
                if(!this.isSectionModified[10]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Purpose'});
                    prompts = ['Why is your vision important to you?', 'What inspires you?', 'What is important to you and why is this important to you?', 'What drives your motivation?', 'What makes you get up in the morning?', 'Where do you get your energy?', 'Who do you hope to impact?'];
                }
                break;
            case 'deliberate_practices':
                if(!this.isSectionModified[11]) {
                    this.setState({wizardVisible: true});
                    this.setState({wizardDest: 'Deliberate Practices'});
                    prompts = ['What do you do to overcome or “check” your bias?', 'How do you expose yourself to new experiences and perspectives?', 'Who do you turn to for advice or help?', 'What activities do you do that are purposeful or systematic to help you achieve your goals?', 'How do you put your values into practice?'];
                }
                break;
            default:            
        }

        if(prompts) {
            for(var i=0; i<prompts.length; i++) {
                visibilities[i] = 'visible';
                visibilitiesBoolean[i] = true;
            }
            for(i=0; i<5-prompts.length; i++) {
                prompts.push('');
            }
        }

        this.setState({wizardPrompts: prompts, wizardVisibilities: visibilities, wizardVisibilitiesBoolean: visibilitiesBoolean, wizardImgIndex: 0, wizardMeanings: []});
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
                        <Button component={ Link } to='/login' variant="outlined" color="primary">NetID Login</Button>
                        <Typography style={{marginTop: 15}} variant='body2'>Login to access your canvas.</Typography>
                    </CardContent>
                </Card>
                </Grid>
                </div>
            );
        }
        
        if(isMobile) {
            return (this.getMobileLayout());
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

                <Dialog
                    open={this.state.isClearDialogOpen}
                    onClose={this.handleCloseClearDialog}
                >
                    <DialogTitle>Clear Canvas Section</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to clear this section? This cannot be reversed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseClearDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleClearSection} color="primary" >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    disableEnforceFocus={false}
                    open={this.state.wizardVisible}
                    onClose={this.handleCloseWizardDialog}
                >
                    <DialogTitle>{this.state.wizardDest} Prompts</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        You can style your entered text on the main screen once you have finished. Feel free to add images and gifs. They will default to the upper left corner of the {this.state.wizardDest} section.
                    </DialogContentText>
                    <div style={{visibility: this.state.wizardVisibilities[0]}}>
                    <br/>
                    <DialogContentText variant="h6" visible={false}>
                        {this.state.wizardPrompts[0]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange1(data);
                        } }
                    />
                    </div>
                    
                    {this.state.wizardVisibilitiesBoolean[1] && <div style={{visibility: this.state.wizardVisibilities[1]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[1]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange2(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[2] && <div style={{visibility: this.state.wizardVisibilities[2]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[2]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange3(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[3] && <div style={{visibility: this.state.wizardVisibilities[3]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[3]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange4(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[4] && <div style={{visibility: this.state.wizardVisibilities[4]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[4]}
                    </DialogContentText>
                    <CKEditor
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange5(data);
                        } }
                    />
                    </div>}
                    <br/>
                    <Grid container spacing={1}>
                        { this.state.wizardImgs.map((img, index) => <Fragment key={index}>{img}</Fragment>) }
                    </Grid>
                    <br/>
                    <Tooltip title='Add Image'>
                        <IconButton color="inherit" onClick={this.handleWizardImage}>
                            <ImageIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Add Gif'>
                        <IconButton color="inherit" onClick={this.handleWizardGif}>
                            <GifIcon />
                        </IconButton>
                    </Tooltip>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleCloseWizardDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleWizardDoneDialog} color="primary" >
                        Done
                    </Button>
                    </DialogActions>
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

                        <Typography style={{margin: 35, marginBottom: 0}} variant='body1'>Try making it your own. You can add resizable pictures and gifs, and you can edit each text to map out your story.</Typography>
                        
                        <Typography style={{margin: 35, marginTop: 0}} color="textSecondary" variant='body2'>Your changes are automatically saved.</Typography>

                    </Box>
                    
                    <Box
                        component={Grid}
                        container
                        spacing={0}
                        direction="column"
                        style={{marginRight: 40}}
                        >
                        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                            <OutlinedCard firstName={this.state.firstName} lastName={this.state.lastName} netid={this.state.netid}/>
                        </Grid>
                    </Box>
                </div>

                <div className='canvas'>
                    <br/>
                    <Spinner className='loader' color='lightgray' style={{visibility: this.state.loaderVisibility}}/>
                    <br/>

                    <div className='canvas__top' ref={this.topDivRef}>

                        <MenuProvider id='vision_context' >
                            <this.visionContext />
                            <div className={this.state.visionClass} onClick={() => this.showWizard('vision')}>
                                {this.getTextCard(this.state.vision, 'vision')}        
                                { [...this.state.visionDragObj.values()].map((img, index) => [...this.state.visionDragObj.values()][index].visible &&  <Fragment key={index}>{img.dragComp}</Fragment>) }                         
                            </div>
                        </MenuProvider>

                    </div>
                    
                    <div className='canvas__middle' ref={this.middleDivRef}>

                        <div className='col__first' ref={this.col1DivRef}>

                            <MenuProvider id='stress_context' >
                                <this.stressContext />
                                <div className={this.state.stressClass} style={{borderRight: 0, borderBottom: 0, borderTop: 0}} onClick={() => this.showWizard('stress')}>
                                    {this.getTextCard(this.state.stress, 'stress')} 
                                    { [...this.state.stressDragObj.values()].map((img, index) => [...this.state.stressDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='behaviors_context' >
                                <this.behaviorsContext />
                                <div className={this.state.behaviorsClass} style={{borderRight: 0, borderBottom: 0, zIndex: 10}} onClick={() => this.showWizard('behaviors')}>
                                    {this.getTextCard(this.state.behaviors, 'behaviors')} 
                                    { [...this.state.behaviorsDragObj.values()].map((img, index) => [...this.state.behaviorsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                        </div>

                        <div className='col__second' ref={this.col2DivRef}>
                            <MenuProvider id='experience_bias_context' >
                                <this.expBiasContext />
                                <div className={this.state.expBiasClass} style={{borderTop: 0, borderBottom: 0}} onClick={() => this.showWizard('experience_bias')}>
                                    {this.getTextCard(this.state.experience_bias, 'experience_bias')}
                                    { [...this.state.expBiasDragObj.values()].map((img, index) => [...this.state.expBiasDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__third' ref={this.col3DivRef}>
                            <MenuProvider id='deliberate_practices_context' >
                                <this.delibPracticesContext />
                                <div className={this.state.delibPracticesClass} style={{borderRight: 0, borderLeft: 0, borderTop: 0}} onClick={() => this.showWizard('deliberate_practices')}>
                                    {this.getTextCard(this.state.deliberate_practices, 'deliberate_practices')}
                                    { [...this.state.delibPracticesDragObj.values()].map((img, index) => [...this.state.delibPracticesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='purpose_context' >
                                <this.purposeContext />
                                <div className={this.state.purposeClass} style={{borderLeft: 0, borderTop: 0, borderRight: 0, borderBottom: 0}} onClick={() => this.showWizard('purpose')}>
                                    {this.getTextCard(this.state.purpose, 'purpose')}
                                    { [...this.state.purposeDragObj.values()].map((img, index) => [...this.state.purposeDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__fourth' ref={this.col4DivRef}>
                            <MenuProvider id='voice_context' >
                                <this.voiceContext />
                                <div className={this.state.voiceClass} style={{borderTop: 0, borderBottom: 0}} onClick={() => this.showWizard('voice')}>
                                    {this.getTextCard(this.state.voice, 'voice')}
                                    { [...this.state.voiceDragObj.values()].map((img, index) => [...this.state.voiceDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                        <div className='col__fifth' ref={this.col5DivRef}>
                            <MenuProvider id='strengths_context' >
                                <this.strengthsContext />
                                <div className={this.state.strengthsClass} style={{borderLeft: 0, borderBottom: 0, borderTop: 0}} onClick={() => this.showWizard('strengths')}>
                                    {this.getTextCard(this.state.strengths, 'strengths')} 
                                    { [...this.state.strengthsDragObj.values()].map((img, index) => [...this.state.strengthsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>

                            <MenuProvider id='energy_context' >
                                <this.energyContext />
                                <div className={this.state.energyClass} style={{borderLeft: 0, borderBottom: 0}} onClick={() => this.showWizard('energy')}>
                                    {this.getTextCard(this.state.energy, 'energy')}
                                    { [...this.state.energyDragObj.values()].map((img, index) => [...this.state.energyDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                                </div>
                            </MenuProvider>
                        </div>

                    </div>

                    <div className='canvas__bottom' ref={this.bottomDivRef}>

                        <MenuProvider id='fixed_mindset_context' >
                            <this.fixedMindsetContext />
                            <div className={this.state.fixedMindsetClass} onClick={() => this.showWizard('fixed_mindset')}>
                                {this.getTextCard(this.state.fixed_mindset, 'fixed_mindset')}
                                { [...this.state.fixedMindsetDragObj.values()].map((img, index) => [...this.state.fixedMindsetDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                            </div>
                        </MenuProvider>


                        <MenuProvider id='values_context' >
                            <this.valuesContext />
                            <div className={this.state.valuesClass} style={{borderLeft: 0, borderRight: 0}} onClick={() => this.showWizard('values')}>
                                {this.getTextCard(this.state.values, 'values')}
                                { [...this.state.valuesDragObj.values()].map((img, index) => [...this.state.valuesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                            </div>
                        </MenuProvider>

                        <MenuProvider id='growth_mindset_context' >
                            <this.growthMindsetContext />
                            <div className={this.state.growthMindsetClass} onClick={() => this.showWizard('growth_mindset')}>
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

    getMobileLayout() {
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

                <Dialog
                    open={this.state.isClearDialogOpen}
                    onClose={this.handleCloseClearDialog}
                >
                    <DialogTitle>Clear Canvas Section</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to clear this section? This cannot be reversed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseClearDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleClearSection} color="primary" >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    disableEnforceFocus={false}
                    open={this.state.wizardVisible}
                    onClose={this.handleCloseWizardDialog}
                >
                    <DialogTitle>{this.state.wizardDest} Prompts</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        You can style your entered text on the main screen once you have finished. Feel free to add images and gifs. They will default to the upper left corner of the {this.state.wizardDest} section.
                    </DialogContentText>
                    <div style={{visibility: this.state.wizardVisibilities[0]}}>
                    <br/>
                    <DialogContentText variant="h6" visible={false}>
                        {this.state.wizardPrompts[0]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange1(data);
                        } }
                    />
                    </div>
                    
                    {this.state.wizardVisibilitiesBoolean[1] && <div style={{visibility: this.state.wizardVisibilities[1]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[1]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange2(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[2] && <div style={{visibility: this.state.wizardVisibilities[2]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[2]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange3(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[3] && <div style={{visibility: this.state.wizardVisibilities[3]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[3]}
                    </DialogContentText>
                    <CKEditor 
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange4(data);
                        } }
                    />
                    </div>}
                    
                    {this.state.wizardVisibilitiesBoolean[4] && <div style={{visibility: this.state.wizardVisibilities[4]}}>
                    <br/>
                    <DialogContentText variant="h6" >
                        {this.state.wizardPrompts[4]}
                    </DialogContentText>
                    <CKEditor
                        editor={ BalloonEditor }
                        config={ this.editorConfiguration }
                        data={ '' }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.wizardChange5(data);
                        } }
                    />
                    </div>}
                    <br/>
                    <Grid container spacing={1}>
                        { this.state.wizardImgs.map((img, index) => <Fragment key={index}>{img}</Fragment>) }
                    </Grid>
                    <br/>
                    <Tooltip title='Add Image'>
                        <IconButton color="inherit" onClick={this.handleWizardImage}>
                            <ImageIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Add Gif'>
                        <IconButton color="inherit" onClick={this.handleWizardGif}>
                            <GifIcon />
                        </IconButton>
                    </Tooltip>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleCloseWizardDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleWizardDoneDialog} color="primary" >
                        Done
                    </Button>
                    </DialogActions>
                </Dialog>

                <MaterialNavBar loggedIn={this.state.loggedIn} title='My Canvas'/>

                <br/><br/><br/><br/>

                <div style={{display: 'flex', flexDirection: 'row'}}>

                    <Box 
                        style={{marginLeft: 20, marginRight: 20}}
                        display='flex' >
                    
                        <Box
                            flexGrow={1}
                            p={1}>
                            <Card elevation={3} > 
                        
                            <Typography style={{margin: 10, marginBottom: 0}} variant='h6'>Try making it your own.</Typography>
                                <Typography style={{margin: 10, marginTop: 5, marginBottom: 0}} variant='body1'>You can add resizable pictures and gifs, and you can edit each text to map out your story.</Typography>
                                <br/>
                                <Typography style={{margin: 10, marginTop: 0}} color="textSecondary" variant='body2'>Your changes are automatically saved.</Typography>
                            
                            </Card>
                        </Box>
                        
                        <Box p={1} >
                            <OutlinedCard firstName={this.state.firstName} lastName={this.state.lastName} netid={this.state.netid}/>
                        </Box>

                    </Box>
                </div>

                <div className='canvas__mobile'>
                    <br/>
                    <Spinner className='loader' color='lightgray' style={{visibility: this.state.loaderVisibility}}/>
                    <br/>

                    <MenuProvider id='vision_context' >
                        <this.visionContext />
                        <div className={this.state.visionMobileClass} onClick={() => this.showWizard('vision')}>
                            {this.getTextCard(this.state.vision, 'vision')}        
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.visionDragObj.values()].map((img, index) => [...this.state.visionDragObj.values()][index].visible &&  <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='stress_context' >
                        <this.stressContext />
                        <div className={this.state.stressMobileClass} onClick={() => this.showWizard('stress')}>
                            {this.getTextCard(this.state.stress, 'stress')} 
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.stressDragObj.values()].map((img, index) => [...this.state.stressDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='behaviors_context' >
                        <this.behaviorsContext />
                        <div className={this.state.behaviorsMobileClass} onClick={() => this.showWizard('behaviors')}>
                            {this.getTextCard(this.state.behaviors, 'behaviors')} 
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.behaviorsDragObj.values()].map((img, index) => [...this.state.behaviorsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='experience_bias_context' >
                        <this.expBiasContext />
                        <div className={this.state.expBiasMobileClass} onClick={() => this.showWizard('experience_bias')}>
                            {this.getTextCard(this.state.experience_bias, 'experience_bias')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.expBiasDragObj.values()].map((img, index) => [...this.state.expBiasDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='deliberate_practices_context' >
                        <this.delibPracticesContext />
                        <div className={this.state.delibPracticesMobileClass} onClick={() => this.showWizard('deliberate_practices')}>
                            {this.getTextCard(this.state.deliberate_practices, 'deliberate_practices')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.delibPracticesDragObj.values()].map((img, index) => [...this.state.delibPracticesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='purpose_context' >
                        <this.purposeContext />
                        <div className={this.state.purposeMobileClass} onClick={() => this.showWizard('purpose')}>
                            {this.getTextCard(this.state.purpose, 'purpose')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.purposeDragObj.values()].map((img, index) => [...this.state.purposeDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='voice_context' >
                        <this.voiceContext />
                        <div className={this.state.voiceMobileClass} onClick={() => this.showWizard('voice')}>
                            {this.getTextCard(this.state.voice, 'voice')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.voiceDragObj.values()].map((img, index) => [...this.state.voiceDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='strengths_context' >
                        <this.strengthsContext />
                        <div className={this.state.strengthsMobileClass} onClick={() => this.showWizard('strengths')}>
                            {this.getTextCard(this.state.strengths, 'strengths')} 
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.strengthsDragObj.values()].map((img, index) => [...this.state.strengthsDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='energy_context' >
                        <this.energyContext />
                        <div className={this.state.energyMobileClass}  onClick={() => this.showWizard('energy')}>
                            {this.getTextCard(this.state.energy, 'energy')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.energyDragObj.values()].map((img, index) => [...this.state.energyDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='fixed_mindset_context' >
                        <this.fixedMindsetContext />
                        <div className={this.state.fixedMindsetMobileClass} onClick={() => this.showWizard('fixed_mindset')}>
                            {this.getTextCard(this.state.fixed_mindset, 'fixed_mindset')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.fixedMindsetDragObj.values()].map((img, index) => [...this.state.fixedMindsetDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='values_context' >
                        <this.valuesContext />
                        <div className={this.state.valuesMobileClass} onClick={() => this.showWizard('values')}>
                            {this.getTextCard(this.state.values, 'values')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.valuesDragObj.values()].map((img, index) => [...this.state.valuesDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <MenuProvider id='growth_mindset_context' >
                        <this.growthMindsetContext />
                        <div className={this.state.growthMindsetMobileClass} onClick={() => this.showWizard('growth_mindset')}>
                            {this.getTextCard(this.state.growth_mindset, 'growth_mindset')}
                        </div>
                    </MenuProvider>

                    <div>
                        { [...this.state.growthMindsetDragObj.values()].map((img, index) => [...this.state.growthMindsetDragObj.values()][index].visible && <Fragment key={index}>{img.dragComp}</Fragment>) }
                    </div>
                    <br/>

                    <br/>
                </div>
            </div>
        )
    }
}

export default Canvas
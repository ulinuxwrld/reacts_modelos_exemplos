import React from 'react';
import classnames from 'classnames';
import TransitionManager from 'react-transition-manager';
import get from 'lodash/object/get';

import Track from '../../adaptors/server/track';
import Flux from '../../flux';
import getFeaturedImage from '../../lib/get-featured-image';

import CloseButton from '../close-button';
import NewsFlash from '../news-flash';
import Rimage from '../rimage';

import {onClickContent} from '../modal';

const takeover = {
  name: "Pause",
  title: "PAUSE",
  description: "Relaxation at your fingertip",
  featured_image: 8672,
  links: [{
    type: 'http',
    text: 'Download on iOS',
    url: 'http://us2.co/Pause'
  }, {
    type: 'http',
    text: 'Go to getpauseapp.com',
    url: 'http://getpauseapp.com/'
  }],
  _embedded: {
    "wp:attachment": [
      {
        "id": 8672,
        "date": "2015-10-05T10:58:17",
        "slug": "pause",
        "type": "attachment",
        "link": "http://ustwo-staging.aws.hmn.md/blog/takeover/pause/pause/",
        "title": {
          "rendered": "pause"
        },
        "author": 3,
        "alt_text": "",
        "media_type": "image",
        "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause.png",
        "media_details": {
          "width": 670,
          "height": 1028,
          "file": "2015/10/pause.png",
          "sizes": {
            "thumbnail": {
              "file": "pause-300x300.png",
              "width": 300,
              "height": 300,
              "mime-type": "image/png",
              "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause-300x300.png"
            },
            "medium": {
              "file": "pause-501x768.png",
              "width": 501,
              "height": 768,
              "mime-type": "image/png",
              "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause-501x768.png"
            },
            "small": {
              "file": "pause-313x480.png",
              "width": 313,
              "height": 480,
              "mime-type": "image/png",
              "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause-313x480.png"
            },
            "small_crop": {
              "file": "pause-640x480.png",
              "width": 640,
              "height": 480,
              "mime-type": "image/png",
              "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause-640x480.png"
            },
            "medium_crop": {
              "file": "pause-670x768.png",
              "width": 670,
              "height": 768,
              "mime-type": "image/png",
              "source_url": "https://hmn-uploads.s3.amazonaws.com/ustwo-staging/uploads/2015/10/pause-670x768.png"
            }
          },
          "image_meta": {
              "aperture": 0,
              "credit": "",
              "camera": "",
              "caption": "",
              "created_timestamp": 0,
              "copyright": "",
              "focal_length": 0,
              "iso": 0,
              "shutter_speed": 0,
              "title": "",
              "orientation": 0
          }
        }
      }
    ]
  }
};

export default class TakeOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false
    };
  }
  render = () => {
    let content;
    const image = getFeaturedImage(takeover);
    // const takeover = this.props.takeover;
    if(this.state.showContent) {
      content = (
        <div key="detail" className="take-over__content">
          <div className="take-over__content__message">
            <CloseButton onClose={this.onClickClose} className="take-over__content__message__close" autoAnim={1000} />
            <Rimage wrap="div" className="take-over__content__image"  sizes={get(image, 'media_details.sizes')}>
            </Rimage>
            <h1 className="take-over__content__message__title" style={{color: "#2a88a9"}}>{takeover.title}</h1>
            <p className="take-over__content__message__description">{takeover.description}</p>
            <ul className="take-over__content__message__links">
              {takeover.links.map(this.renderLink)}
            </ul>
          </div>
        </div>
      );
    } else {
      content = (
        <div key="news-flash" className="take-over__news-flash">
          <NewsFlash className="take-over__news-flash__animation" autoAnim={50} loop={true} />
          <h1 className="take-over__news-flash__title">News</h1>
        </div>
      );
    }
    return (
      <TransitionManager className={`take-over ${this.props.className}`} component="div" duration={800} onClick={onClickContent}>
        {content}
      </TransitionManager>
    );
  }
  renderLink = (link, index) => {
    let prefix = "";
    switch(link.type) {
      case 'email':
        prefix = "mailto:";
      break;
      case 'tel':
        prefix = "tel:";
      break;
    }
    return <li className={`take-over__content__message__links__link-item ${link.type}`}><a className="take-over__content__message__links__link-item__link" target="_blank" href={`${prefix}${link.url}`} onClick={this.onClickLink(index)} style={{color: "#2a88a9"}}>{link.text}</a></li>;
  }
  componentDidMount() {
    this.contentTimeout = setTimeout(() => {
      this.setState({
        showContent: true
      });
    }, 3000);
  }
  componentWillUnmount() {
    clearTimeout(this.contentTimeout);
  }
  onClickClose() {
    // const takeover = this.props.takeover;
    Track('send', {
      'hitType': 'event',          // Required.
      'eventCategory': 'takeover',   // Required.
      'eventAction': 'click_takeover_x',  // Required.
      'eventLabel': takeover.name // Name of the takeover as set in WordPress
    });
    Flux.closeTakeover();
  }
  onClickLink(index) {
    // const takeover = this.props.takeover;
    return (e) => {
      Track('send', {
        'hitType': 'event',          // Required.
        'eventCategory': 'takeover',   // Required.
        'eventAction': 'click_link_' + index+1,  // Required.
        'eventLabel': takeover.name // Name of the takeover as set in WordPress
      });
    }
  }
};
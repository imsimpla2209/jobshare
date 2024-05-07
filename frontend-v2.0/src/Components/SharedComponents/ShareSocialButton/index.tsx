import React from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share'

import './Demo.css';

function ShareSocialButton({
  shareUrl
  , title
}: any) {
  // const shareUrl = 'http://github.com';

  return (
    <div className="Demo__container">
      <div className="Demo__some-network">
        <FacebookShareButton url={shareUrl || 'http://github.com'} className="Demo__some-network__share-button">
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <div>
          <FacebookShareCount url={shareUrl || 'http://github.com'} className="Demo__some-network__share-count">
            {count => count}
          </FacebookShareCount>
        </div>
      </div>

      <div className="Demo__some-network">
        <FacebookMessengerShareButton
          url={shareUrl || 'http://github.com'}
          appId="521270401588372"
          className="Demo__some-network__share-button"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>

      <div className="Demo__some-network">
        <TwitterShareButton
          url={shareUrl || 'http://github.com'}
          title={title || 'From The JobShare - biggest job search engine'}
          className="Demo__some-network__share-button"
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>

      <div className="Demo__some-network">
        <TelegramShareButton
          url={shareUrl || 'http://github.com'}
          title={title || 'From The JobShare - biggest job search engine'}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>

      <div className="Demo__some-network">
        <WhatsappShareButton
          url={shareUrl || 'http://github.com'}
          title={title || 'From The JobShare - biggest job search engine'}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      <div className="Demo__some-network">
        <LinkedinShareButton url={shareUrl || 'http://github.com'} className="Demo__some-network__share-button">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
      <div className="Demo__some-network">
        <RedditShareButton
          url={shareUrl || 'http://github.com'}
          title={title || 'From The JobShare - biggest job search engine'}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button"
        >
          <RedditIcon size={32} round />
        </RedditShareButton>

        <div>
          <RedditShareCount url={shareUrl || 'http://github.com'} className="Demo__some-network__share-count" />
        </div>
      </div>

      <div className="Demo__some-network">
        <EmailShareButton
          url={shareUrl}
          subject={title || 'From The JobShare - biggest job search engine'}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </div>
  )
}

export { ShareSocialButton }
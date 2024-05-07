/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './style.css';

const CommentBlock = () => {
  return (
    <div className="block">
      <div className="block-header">
        <div className="title">
          <h2>Comments</h2>
          <div className="tag">12</div>
        </div>
        <div className="group-radio">
          <span className="button-radio">
            <input id="latest" name="latest" type="radio" defaultChecked />
            <label htmlFor="latest">Latest</label>
          </span>
          <div className="divider"></div>
          <span className="button-radio">
            <input id="popular" name="latest" type="radio" />
            <label htmlFor="popular">Popular</label>
          </span>
        </div>
      </div>
      <div className="writing">
        <div contentEditable="true" className="textarea" autoFocus spellCheck="false">
          <p>Hi <a className="tagged-user">@Jo</a></p>
        </div>
        <div className="footer">
          <div className="text-format">
            <button className="btn"><i className="ri-bold"></i></button>
            <button className="btn"><i className="ri-italic"></i></button>
            <button className="btn"><i className="ri-underline"></i></button>
            <button className="btn"><i className="ri-list-unordered"></i></button>
          </div>
          <div className="group-button">
            <button className="btn"><i className="ri-at-line"></i></button>
            <button className="btn primary">Send</button>
          </div>
        </div>
      </div>
      <div className="comment">
        <div className="user-banner">
          <div className="user">
            <div className="avatar">
              <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="" />
              <span className="stat grey"></span>
            </div>
            <h5>Floyd Miles</h5>
          </div>
          <button className="btn dropdown"><i className="ri-more-line"></i></button>
        </div>
        <div className="content">
          <p>Actually, now that I try out the links on my message, above, none of them take me to the secure site. Only my shortcut on my desktop, which I created years ago.</p>
        </div>
        <div className="footer">
          <button className="btn"><i className="ri-emotion-line"></i></button>
          <div className="reactions">
            <button className="btn react"><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/thumbs-up_1f44d.png" alt="" />4</button>
            <button className="btn react"><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/angry-face-with-horns_1f47f.png" alt="" />1</button>
          </div>
          <div className="divider"></div>
          <a href="#">Reply</a>
          <div className="divider"></div>
          <span className="is-mute">6 hour</span>
        </div>
      </div>
      <div>
        {/* Second comment */}
        <div className="comment">
          <div className="user-banner">
            <div className="user">
              <div className="avatar" style={{ backgroundColor: '#fff5e9', borderColor: '#ffe0bd', color: '#F98600' }}>
                AF
                <span className="stat green"></span>
              </div>
              <h5>Albert Flores</h5>
            </div>
            <button className="btn dropdown"><i className="ri-more-line"></i></button>
          </div>
          <div className="content">
            <p>Before installing this plugin, please put back again your WordPress and site URL back to http.</p>
          </div>
          <div className="footer">
            <button className="btn"><i className="ri-emotion-line"></i></button>
            <div className="divider"></div>
            <a href="#">Reply</a>
            <div className="divider"></div>
            <span className="is-mute">2 min</span>
          </div>
        </div>

        {/* Reply to the second comment */}
        <div className="reply comment">
          <div className="user-banner">
            <div className="user">
              <div className="avatar">
                <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" alt="" />
                <span className="stat green"></span>
              </div>
              <h5>Bessie Cooper</h5>
            </div>
            <button className="btn dropdown"><i className="ri-more-line"></i></button>
          </div>
          <div className="content">
            <p>Hi <a href="#" className="tagged-user">@Albert Flores</a>. Thanks for your reply.</p>
          </div>
          <div className="footer">
            <button className="btn"><i className="ri-emotion-line"></i></button>
            <div className="reactions">
              <button className="btn react"><img src="https://cdn-0.emojis.wiki/emoji-pics/apple/smiling-face-with-heart-eyes-apple.png" alt="" />2</button>
            </div>
            <div className="divider"></div>
            <a href="#">Reply</a>
            <div className="divider"></div>
            <span className="is-mute">18 sec</span>
          </div>
        </div>
      </div>
      <div className="load">
        <span><i className="ri-refresh-line"></i>Loading</span>
      </div>
    </div>
  );
};

export default CommentBlock;

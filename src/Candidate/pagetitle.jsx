import React, { Component } from "react";
import { connect } from "react-redux";
import cx from "classnames";


class PageTitle extends Component {


    render() {
        let {
            heading,
            subheading,
            jobTitle,
            icon
        } = this.props;



        return (
            <div className="app-page-title" style={{ marginRight: '0px',height:'95px',color:'rgb(33, 91, 153)',fontWeight:'600' }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className={cx("page-title-icon", {
                            "d-none": false,
                        })}>
                            <img src={icon} />
                        </div>
                        
                        <div className="page-title">
                            {heading} {jobTitle}
                            <div className={cx("page-title-subheading", {
                                "d-none": true,
                            })}>
                                {subheading}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    enablePageTitleIcon: true,
    enablePageTitleSubheading: true,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PageTitle);

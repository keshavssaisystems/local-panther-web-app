import React from "react";

export default function EducationAIProfile() {
    return (
        <div>
            <h5>Education</h5>

            {/* Updated Card */}
            <div
                style={{
                    border: "2px solid #facc15",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#fefce8",
                    marginBottom: "20px",
                    position: "relative",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "-10px",
                        right: "10px",
                        background: "#f59e0b",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                    }}
                >
                    Updated
                </span>

                <div className="row mb-2">
                    <div className="col-md-6">
                        <label>Level of education</label>
                        <select className="form-control" defaultValue="Master">
                            <option>Master's Degree</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label>Field of study</label>
                        <select className="form-control" defaultValue="CS">
                            <option>Computer Science</option>
                        </select>
                    </div>
                </div>

                <div className="mb-2">
                    <label>School</label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue="International College of Arts and Science (UG)"
                    />
                </div>

                <div className="row mb-2">
                    <div className="col-md-6">
                        <label>City, State</label>
                        <select className="form-control" defaultValue="LA">
                            <option>Los Angeles, California</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label>Country</label>
                        <select className="form-control" defaultValue="USA">
                            <option>USA</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-6">
                        <label>From</label>
                        <div className="d-flex gap-2">
                            <select className="form-control" defaultValue="Jan">
                                <option>Jan</option>
                            </select>
                            <select className="form-control" defaultValue="2020">
                                <option>2020</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label>To</label>
                        <div className="d-flex gap-2">
                            <select className="form-control" defaultValue="Aug">
                                <option>Aug</option>
                            </select>
                            <select className="form-control" defaultValue="2025">
                                <option>2025</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deleted Card */}
            <div
                style={{
                    border: "2px dashed red",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#fef2f2",
                    position: "relative",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "-10px",
                        right: "10px",
                        background: "red",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                    }}
                >
                    Deleted
                </span>

                <div style={{ opacity: 0.6, pointerEvents: "none" }}>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <label>Level of education</label>
                            <select className="form-control" disabled defaultValue="HSC">
                                <option>Higher Secondary Certificate (HSC)</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>Field of study</label>
                            <select className="form-control" disabled defaultValue="Science">
                                <option>Science</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-2">
                        <label>School</label>
                        <input
                            type="text"
                            className="form-control"
                            disabled
                            defaultValue="John Higher Secondary School"
                        />
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-6">
                            <label>City, State</label>
                            <select className="form-control" disabled>
                                <option>Los Angeles, California</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>Country</label>
                            <select className="form-control" disabled>
                                <option>USA</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-6">
                            <label>From</label>
                            <div className="d-flex gap-2">
                                <select className="form-control" disabled>
                                    <option>Jan</option>
                                </select>
                                <select className="form-control" disabled>
                                    <option>2014</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label>To</label>
                            <div className="d-flex gap-2">
                                <select className="form-control" disabled>
                                    <option>Mar</option>
                                </select>
                                <select className="form-control" disabled>
                                    <option>2016</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <h6
                    style={{
                        textAlign: "center",
                        marginTop: "10px",
                        color: "red",
                        fontWeight: "bold",
                        transform: "rotate(-10deg)",
                    }}
                >
                    DELETED
                </h6>
            </div>
        </div>
    );
}

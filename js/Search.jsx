import React from 'react'
import {Link} from 'react-router-dom';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchList: [],
            displayResults: false
        }
    }

    render() {
        var searchResult = this.state.searchList.map((item, index) => {
            return(
                <Link to={`/goods/${item.id}`}>
                <div>
                    <img src={item.photo} className="search-result-image"/>
                    <p>{item.goodName}</p>
                    <hr/>
                </div>
                </Link>
            );
        });
        return(
            <div style={{position: 'relative'}}>
                <input type="text" className="search-input" onChange={() => {
                    $.ajax({
                        type: "post",
                        url: '/search',
                        data: {searchParams: document.querySelector('.search-input').value},
                        success: function(res){
                            this.setState({searchList: res});
                        }.bind(this),
                        dataType: 'json',
                        async: false
                    });
                    $('.search-results').css('display', 'block');
                }}></input>
                <div className="search-results">
                    {searchResult}
                </div>
            </div>
        );
    }
}

export {Search};

import React from 'react';
import { connect } from 'react-redux';
import { fetchingSingleDrink } from '../store/singledrinks';
import { addItem } from '../store/cart.js';

export class SingleDrinkDetail extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    await this.props.getSingleDrink(id);
  }

  handleClick() {
    this.props.addItem(this.props.singleDrink);
  }

  render() {
    console.log(this.props.singleDrink);
    const currentDrink = this.props.drinkFromRedux;
    return (
      <div>
        <img className='detailsImage' src={currentDrink.image}></img>
        <div className='detailsWrapper'>
          <button className='detailsButton' onClick={this.handleClick}>
            Add to cart here
          </button>

          <p>Drink: {currentDrink.name}</p>
          <p>Base: {currentDrink.baseLiquor}</p>
          <p>Price: {currentDrink.price}</p>
          <p>Alcohol Content: {currentDrink.alcoholContent}</p>
          <p>Current Stock: {currentDrink.stock}</p>
          <p>{currentDrink.description}</p>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    drinkFromRedux: state.singleDrink,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getSingleDrink: (id) => {
      dispatch(fetchingSingleDrink(id));
    },
    addItem: (cartItem) => {
      dispatch(addItem(cartItem));
    },
  };
};

export default connect(mapState, mapDispatch)(SingleDrinkDetail);

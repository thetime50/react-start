import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 没有加历史步骤的版本

class Square extends React.Component {
    // constructor(props) {
    //     super(props)
    //     // this.state = {
    //     //     value: null,
    //     // }
    // }

    render() {
        return (
            <button className="square"
                onClick={
                    // function() {
                    //     console.log('click', this)
                    // }
                    () => {
                        console.log('click', this)
                        // this.setState({ value: 'X' }) //每次在组件中调用 setState 时，React 都会自动更新其子组件。
                        this.props.onClick()
                    }
                }>
                {
                    this.props.value
                    // this.state.value
                }
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

    handelClick(i) {
        const squares = this.state.squares.slice() //whay
        // 不需要监控内部的节点
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        }) // 触发受控组件重新渲染
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handelClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

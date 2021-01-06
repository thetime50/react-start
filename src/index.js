import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    // constructor(props) {
    //     super(props)
    //     // this.state = {
    //     //     value: null,
    //     // }
    // }

    render() {
        let className = ["square"]
        if (this.props.current) {
            className.push('current')
        }
        return (
            <button className={className.join(' ')}
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
    renderSquare(i) {
        return (
            <Square
                // value={this.state.squares[i]}
                value={this.props.squares[i]}
                // onClick={() => this.handelClick(i)}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        let arr3 = Array(3).fill(3)
        let rows = arr3.map((r, ri, ra) => {
            let cols = arr3.map((c, ci, ca) => {
                return this.renderSquare(3 * ri + ci)
            })
            return (
                <div className="board-row" key={ri}>
                    {cols}
                </div>
            )
        })
        console.log(rows)
        return (
            <div>
                {rows}
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
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                x: '-',
                y: '-',
                pieces: '',
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handelClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //悔棋
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let x = i % 3
        let y = Math.floor(i / 3)
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        let pieces = this.state.xIsNext ? 'X' : 'O'
        squares[i] = pieces
        this.setState({
            history: history.concat([{
                squares: squares,
                x: x,
                y: y,
                pieces: pieces,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        }) // 触发受控组件重新渲染
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let isHistory = this.state.stepNumber < this.state.history.length - 1

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            // React 默认把数组索引当作key (不过最好不用用索引作为key)
            // key只需要保证同级元素里是唯一的
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handelClick(i)}
                        current={current.x * current.y}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    {
                        (isHistory) ?
                            (<div>Move later:({`${current.x},${current.y} ${current.pieces}`})</div>) :
                            ('')
                    }
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

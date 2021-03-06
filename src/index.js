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
        let { isWinner, current } = this.props
        let className = ["square"]
        if (current) {
            className.push('current')
        }
        if (isWinner) {
            className.push("blue")
        }
        return (
            <button className={className.join(' ')}
                onClick={
                    // function() {
                    //     console.log('click', this)
                    // }
                    () => {
                        // console.log('click', this)
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
    renderSquare(i, current, isWinner) {
        return (
            <Square
                // value={this.state.squares[i]}
                value={this.props.squares[i]}
                // onClick={() => this.handelClick(i)}
                onClick={() => this.props.onClick(i)}
                current={current}
                isWinner={isWinner}
                key={i}
            />
        );
    }

    render() {
        let winner = this.props.winner
        let arr3 = Array(3).fill(3)
        let rows = arr3.map((r, ri, ra) => {
            let cols = arr3.map((c, ci, ca) => {
                let index = 3 * ri + ci
                let isWinner = winner && winner.indexOf(index) >= 0
                return this.renderSquare(index, index === this.props.current, isWinner)
            })
            return (
                <div className="board-row" key={ri}>
                    {cols}
                </div>
            )
        })
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
            return {
                pieces: squares[a],
                match: lines[i],
            };
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
            sortUp: false,
        }
    }

    handelClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //悔棋
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let x = i % 3
        let y = Math.floor(i / 3)
        if (calculateWinner(squares) || squares[i] || history.length >= 10) {
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
        const { history, sortUp } = this.state;
        const current = history[this.state.stepNumber];
        const { pieces: winner, match: winMatch } = calculateWinner(current.squares) || {};
        let isHistory = this.state.stepNumber < this.state.history.length - 1
        let draw = this.state.history.length >= 10 && !winner

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            // React 默认把数组索引当作key (不过最好不用用索引作为key)
            // key只需要保证同级元素里是唯一的
            return (
                <li key={move}>
                    {move}、 <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (!sortUp) {
            moves.reverse()
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (draw) {
            status = 'draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handelClick(i)}
                        current={current.x + 3 * current.y}
                        winner={winMatch}
                    />
                </div>
                <div className="game-info">
                    <div onClick={() => { this.setState({ sortUp: !sortUp }) }}>
                        排序
                        <span className={sortUp ? 'blue' : ''}>↑</span><span className={!sortUp ? 'blue' : ''}>↓</span>
                    </div>
                    <div>{status}</div>
                    <ul>
                        {moves}
                    </ul>
                    {
                        (isHistory) ?
                            (<div>Move later:({`${current.x},${current.y} ${current.pieces}`})</div>) :
                            ('')
                    }
                </div>
            </div >
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// [x] 在游戏历史记录列表显示每一步棋的坐标，格式为(列号, 行号) 。
// [x] 在历史记录列表中加粗显示当前选择的项目。
// [x] 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
// 添加一个可以升序或降序显示历史记录的按钮。
// 每当有人获胜时，高亮显示连成一线的 3 颗棋子。
// 当无人获胜时，显示一个平局的消息。

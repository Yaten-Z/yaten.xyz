document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverDiv = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    // 游戏设置
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let speed = 7; // 初始速度
    
    // 游戏状态
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameRunning = false;
    let gamePaused = false;
    let gameLoop;
    
    // 初始化游戏
    function initGame() {
        // 初始化蛇
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // 初始方向
        direction = 'right';
        nextDirection = 'right';
        
        // 初始分数
        score = 0;
        scoreDisplay.textContent = `得分: ${score}`;
        
        // 生成食物
        generateFood();
        
        // 隐藏游戏结束界面
        gameOverDiv.style.display = 'none';
        
        // 开始游戏循环
        if (gameLoop) clearInterval(gameLoop);
        gameRunning = true;
        gamePaused = false;
        gameLoop = setInterval(gameStep, 1000 / speed);
    }
    
    // 生成食物
    function generateFood() {
        let validPosition = false;
        
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            // 确保食物不会生成在蛇身上
            validPosition = true;
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
    
    // 游戏主循环
    function gameStep() {
        if (gamePaused) return;
        
        // 更新方向
        direction = nextDirection;
        
        // 移动蛇
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // 检查碰撞
        if (
            head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }
        
        // 添加新头部
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            // 增加分数
            score += 10;
            scoreDisplay.textContent = `得分: ${score}`;
            
            // 每得100分增加速度
            if (score % 100 === 0) {
                speed += 1;
                clearInterval(gameLoop);
                gameLoop = setInterval(gameStep, 1000 / speed);
            }
            
            // 生成新食物
            generateFood();
        } else {
            // 如果没有吃到食物，移除尾部
            snake.pop();
        }
        
        // 绘制游戏
        drawGame();
    }
    
    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            
            // 蛇头用不同颜色
            if (i === 0) {
                ctx.fillStyle = '#4CAF50'; // 蛇头绿色
            } else {
                ctx.fillStyle = '#8BC34A'; // 蛇身浅绿色
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // 蛇身连接处的圆角效果
            if (i > 0) {
                const prev = snake[i - 1];
                if (prev.x === segment.x) {
                    // 垂直方向
                    ctx.beginPath();
                    ctx.arc(
                        segment.x * gridSize + gridSize / 2,
                        Math.min(segment.y, prev.y) * gridSize + gridSize / 2,
                        gridSize / 2 - 1,
                        0,
                        Math.PI
                    );
                    ctx.arc(
                        segment.x * gridSize + gridSize / 2,
                        Math.max(segment.y, prev.y) * gridSize + gridSize / 2,
                        gridSize / 2 - 1,
                        Math.PI,
                        2 * Math.PI
                    );
                    ctx.fill();
                } else if (prev.y === segment.y) {
                    // 水平方向
                    ctx.beginPath();
                    ctx.arc(
                        Math.min(segment.x, prev.x) * gridSize + gridSize / 2,
                        segment.y * gridSize + gridSize / 2,
                        gridSize / 2 - 1,
                        Math.PI / 2,
                        3 * Math.PI / 2
                    );
                    ctx.arc(
                        Math.max(segment.x, prev.x) * gridSize + gridSize / 2,
                        segment.y * gridSize + gridSize / 2,
                        gridSize / 2 - 1,
                        3 * Math.PI / 2,
                        Math.PI / 2
                    );
                    ctx.fill();
                }
            }
        }
        
        // 绘制食物
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 1,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
    
    // 游戏结束
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        
        // 显示游戏结束界面
        finalScoreDisplay.textContent = `得分: ${score}`;
        gameOverDiv.style.display = 'block';
    }
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                // 空格键暂停/继续
                gamePaused = !gamePaused;
                break;
        }
    });
    
    // 按钮事件
    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        initGame();
    });
    
    restartBtn.addEventListener('click', () => {
        gameOverDiv.style.display = 'none';
        initGame();
    });
    
    // 初始绘制
    drawGame();
});
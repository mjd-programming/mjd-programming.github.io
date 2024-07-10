const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 320;
const CANVAS_HEIGHT = canvas.height = 480;

let key = null;

shapes = [
    [['....','oooo','....','....'],
     ['..o.','..o.','..o.','..o.'],
     ['....','....','oooo','....'],
     ['.o..','.o..','.o..','.o..']],
    [['o...','ooo.','....','....'],
     ['.oo.','.o..','.o..','....'],
     ['....','ooo.','..o.','....'],
     ['.o..','.o..','oo..','....']],
    [['..o.','ooo.','....','....'],
     ['.o..','.o..','.oo.','....'],
     ['....','ooo.','o...','....'],
     ['oo..','.o..','.o..','....']],
    [['.oo.','.oo.','....','....'],
     ['.oo.','.oo.','....','....'],
     ['.oo.','.oo.','....','....'],
     ['.oo.','.oo.','....','....']],
    [['.oo.','oo..','....','....'],
     ['.o..','.oo.','..o.','....'],
     ['....','.oo.','oo..','....'],
     ['o...','oo..','.o..','....']],
    [['.o..','ooo.','....','....'],
     ['.o..','.oo.','.o..','....'],
     ['....','ooo.','.o..','....'],
     ['.o..','oo..','.o..','....']],
    [['oo..','.oo.','....','....'],
     ['..o.','.oo.','.o..','....'],
     ['....','oo..','.oo.','....'],
     ['.o..','oo..','o...','....']]
];

shape_indecies = ['i','j','l','o','s','t','z'];

colors = ['#00ffff','#0000ff','#ff8800','#ffff00','#00ff00','#ff00ff','#ff0000'];
board_color = '#dcdcdc';
background_color = '#a1a1a1';
LINE_COLOR = '#bcbcbc';
starting_positions = [3, -1];

FPS = 20;

block_size = 20;
s_width = 18 * block_size;
s_height = 26 * block_size;
play_width = 10 * block_size;
play_height = 20 * block_size;

top_left_x = 1 * block_size;
top_left_y = 1 * block_size;

class Piece {
    constructor(sx, sy, s) {
        this.x = sx;
        this.y = sy;
        this.shape = s;
        this.color = colors[s];
        this.spin = 0;
        this.floored = [false];
        this.total_floors = 0;
        this.floor_length = 1;
    }

    reset_floored = function() {
        this.floored.forEach(i => i = false);
    }

    set_floored = function(i) {
        for (let c = 0; c < i - 1; c++) {
            this.floored.push(false);
        }
    }

    increase_floored = function() {
        this.total_floors++;
        this.floored.forEach(c => {
            if (c == null || c == false) {
                c = true;
                return false;
            }
        });
        return true;
    }

    set_floored_size = function(gs) {
        while (this.floored.length < gs) {
            this.floored.push(false);
        }
    }
        
    move_left = function(n=1) {
        for (let i = 0; i < n; i++) {
            this.x--;
        }
    }

    move_right = function(n=1) {
        for (let i = 0; i < n; i++) {
            this.x++;
        }
    }

    move_up = function(n=1) {
        for (let i = 0; i < n; i++) {
            this.y--;
        }
    }

    move_down = function(n=1) {
        for (let i = 0; i < n; i++) {
            this.y++;
        }
    }

    spin_left = function() {
        this.spin = (this.spin - 1) % shapes[this.shape].length;
    }
        
    spin_right = function() {
        this.spin = (this.spin + 1) % shapes[this.shape].length;
    }
}

get_format = function(p) {
    return shapes[p.shape][p.spin % shapes[p.shape].length];
}

get_grid = function(locked={}) {
    var g = []
    for (let r = 0; r < 20; r++) {
        t = []
        for (let c = 0; c < 10; c++) {
            if ([c, r] in locked) {
                t.push(locked[[c, r]]);
            } else {
                t.push(board_color);
            }
        }
        g.push(t);
    }
    return g;
}

get_dist_to_true_bottum = function(p) {
    var f = structuredClone(get_format(p)).reverse();
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (f[row][col] == 'o') {
                return 4 - row;
            }
        }
    }
}

get_dist_to_true_right = function(p) {
    switch (p.shape) {
        case 0:
            if (p.spin == 0) {
                return 3;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 3;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 1:
            if (p.spin == 0) {
                return 2;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 2;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 2:
            if (p.spin == 0) {
                return 2;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 2;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 3:
            if (p.spin == 0) {
                return 3;
            }
            if (p.spin == 1) {
                return 3;
            }
            if (p.spin == 2) {
                return 3;
            }
            if (p.spin == 3) {
                return 3;
            }
            break;
        case 4:
            if (p.spin == 0) {
                return 2;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 2;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 5:
            if (p.spin == 0) {
                return 2;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 2;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 6:
            if (p.spin == 0) {
                return 2;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 2;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        default:
            return 0;
    }
}

get_dist_to_true_left = function(p) {
    switch (p.shape) {
        case 0:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 2;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 1:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 0;
            }
            break;
        case 2:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 0;
            }
            break;
        case 3:
            if (p.spin == 0) {
                return 1;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 1;
            }
            if (p.spin == 3) {
                return 1;
            }
            break;
        case 4:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 0;
            }
            break;
        case 5:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 0;
            }
            break;
        case 6:
            if (p.spin == 0) {
                return 0;
            }
            if (p.spin == 1) {
                return 1;
            }
            if (p.spin == 2) {
                return 0;
            }
            if (p.spin == 3) {
                return 0;
            }
            break;
        default:
            return 0;
    }
}

get_piece_positions = function(p) {
    var positions = [];
    var f = structuredClone(get_format(p));
    for (let i = 0; i < f.length; i++) {
        var row = f[i].split('');
        for (let j = 0; j < row.length; j++) {
            if (row[j] == 'o') {
                positions.push([p.x + j, p.y + i]);
            }
        }
    }
    return positions;
}

is_valid = function(p, g, gh=null) {
    // console.log(p.x);
    if (p.y + get_dist_to_true_bottum(p) > 20) { return false; }
    // console.log(get_dist_to_true_left(p));
    if (p.x + get_dist_to_true_left(p) < 0 || p.x + get_dist_to_true_right(p) > 9) { return false; }
    let posits = get_piece_positions(p);
    for (let position_index = 0; position_index < 4; position_index++) {
        let x = posits[position_index][0];
        let y = posits[position_index][1];
        if (x == null || y == null || x < 0 || x > 9 || y < 0 || y > 19) { return true; }
        if (g[y][x] != board_color) {
            return false;
        }
    }
    // if (p.x == -1) { console.log('w'); }
    return true;
}

has_lost = function(positions) {
    for (var pos in positions) {
        var x = parseInt(pos.split(',')[0]);
        var y = parseInt(pos.split(',')[1]);
        if (y <= 0 && x > starting_positions[0] - 2 && x < starting_positions[0] + 2) {
            return true;
        }
        if (y < 0) {
            return true;
        }
    }
    return false;
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        
      // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
      // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

get_new_bag = function() {
    var o_bag = []
    for (let i = 0; i < 7; i++) {
        o_bag.push(new Piece(starting_positions[0], starting_positions[1], i));
    }
    shuffle(o_bag);
    return o_bag;
}

get_next_piece = function(b) {
    if (b.length == 7) {
        b.push(...get_new_bag());
    }
    return b.shift(0)
}

clear_rows = function(g, l) {
    var clear_rows = []
    for (let row = 0; row < 20; row++) {
        if (!g[row].includes(board_color)) {
            clear_rows.push(row);
        }
    }
    for (let c in l) {
        var y = parseInt(c.split(',')[1])
        if (clear_rows.includes(y)) {
            delete l[c];
        }
    }
    var new_g = []
    for (let row = 0; row < 20; row++) {
        if (!clear_rows.includes(row)) {
            new_g.push(g[row]);
        }
    }
    var blank_row = [];
    for (let i = 0; i < 10; i++) {
        blank_row.push(board_color);
    }
    while (new_g.length < 20) {
        new_g.unshift(blank_row);
    }
    let new_locked = {}
    if (clear_rows.length > 0) {
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                if (new_g[row][col] != board_color) {
                    var p = Array(col, row)
                    new_locked[p] = new_g[row][col];
                }
            }
        }
        locked_positions = new_locked;
    }
    return clear_rows.length;
}

remove_piece = function(g, p) {
    var f = get_format(p);
    for (let i = 0; i < f.length; i++) {
        row = f[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] == '0') {
                g[i][j] = board_color;
            }
        }
    }
}

spin_right_handler = function(p, g) {
    p.spin_right();
    if (!is_valid(p, g)) {
        if (p.shape == shape_indecies.indexOf('t')) {
            p.move_down(2);
            p.move_left();
            if (!is_valid(p, g)) {
                p.move_up(2);
                p.move_right();
            } else {
                return false;
            }
        }
        if (p.shape == shape_indecies.indexOf('l')) {
            p.move_down(2);
            p.move_left();
            if (!is_valid(p, g)) {
                p.move_up(2);
                p.move_right();
            } else {
                return false;
            }
        }
        p.move_down();
    }
    if (!is_valid(p, g)) { p.move_left(); }
    else { return false; }
    if (!is_valid(p, g)) { p.move_right(2); }
    else { return false; }
    if (!is_valid(p, g)) { 
        p.move_up();
        p.move_left(2);
    } else { return false; }    
    if (!is_valid(p, g)) { p.move_right(2); }
    else { return false; }
    if (!is_valid(p, g)) {
        p.move_left();
        p.move_up();
    } else { return false; }
    if (!is_valid(p, g)) { p.move_left(); }
    else { return false; }
    if (!is_valid(p, g)) { p.move_right(2); }
    else { return false; }
    if (!is_valid(p, g)) {
        p.move_down();
        p.move_left();
    } else { return false; }
    p.spin_left();
    return true;
}

spin_left_handler = function(p, g) {
    p.spin_left();
    if (!is_valid(p, g)) {
        if (p.shape == shape_indecies.indexOf('t')) {
            p.move_down(2);
            p.move_right();
            if (!is_valid(p, g)) {
                p.move_up(2);
                p.move_left();
            } else { return false; }
        }
        if (p.shape == shape_indecies.indexOf('j')) {
            p.move_down(2);
            p.move_right();
            if (!is_valid(p, g)) {
                p.move_up(2);
                p.move_left();
            } else { return false; }
        }
        p.move_down();
    }
    if (!is_valid(p, g)) { p.move_right(); }
    else { return false; }
    if (!is_valid(p, g)) { p.move_left(2); }
    else { return false; }
    if (!is_valid(p, g)) { 
        p.move_up();
        p.move_right(2);
    } else { return false; }    
    if (!is_valid(p, g)) { p.move_left(2); }
    else { return false; }
    if (!is_valid(p, g)) {
        p.move_right();
        p.move_up();
    } else { return false; }
    if (!is_valid(p, g)) { p.move_right(); }
    else { return false; }
    if (!is_valid(p, g)) { p.move_left(2); }
    else { return false; }
    if (!is_valid(p, g)) {
        p.move_down();
        p.move_right();
    } else { return false; }
    p.spin_right();
    return true;
}
/*
def get_stack_height(l):
    return 19 - sorted(l, key=lambda x: x[1])[0][1]
*/
    /*
def draw_text_middle(text, size, color, surface):
    font = pygame.font.SysFont('comicsans', int(block_size * size / 30), bold=true)
    bg_label = font.render(text, 1, (0,0,0))
    label = font.render(text, 1, color)

    surface.blit(bg_label, (top_left_x + play_width/2 - (label.get_width() / 2) - 2, top_left_y + play_height/2 - label.get_height()/2))
    surface.blit(bg_label, (top_left_x + play_width/2 - (label.get_width() / 2) + 2, top_left_y + play_height/2 - label.get_height()/2))
    surface.blit(bg_label, (top_left_x + play_width/2 - (label.get_width() / 2), top_left_y + play_height/2 - label.get_height()/2 - 2))
    surface.blit(bg_label, (top_left_x + play_width/2 - (label.get_width() / 2), top_left_y + play_height/2 - label.get_height()/2 + 2))
    surface.blit(label, (top_left_x + play_width/2 - (label.get_width() / 2), top_left_y + play_height/2 - label.get_height()/2))
*/

function drawSquareAt(x, y, c) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = c;
    ctx.fillRect(x, y, block_size, block_size);
    ctx.strokeRect(x, y, block_size, block_size);
}

function drawGrid(sx, sy) {
    ctx.fillStyle = board_color;
    ctx.fillRect(top_left_x, top_left_y, block_size * 10, block_size * 20);
    ctx.strokeStyle = LINE_COLOR;
    for (let c = 1; c < 10; c++) {
        ctx.beginPath();
        ctx.moveTo(sx + c * block_size, sy);
        ctx.lineTo(sx + c * block_size, sy + block_size * 20);
        ctx.closePath();
        ctx.stroke();
    }
    for (let r = 1; r < 20; r++) {
        ctx.beginPath();
        ctx.moveTo(sx, sy + r * block_size);
        ctx.lineTo(sx + block_size * 10, sy + r * block_size);
        ctx.closePath();
        ctx.stroke();
    }
}
/* 
def draw_next_shapes(shapes, surface):
    font = pygame.font.SysFont('Arial', int(block_size * 40 / 30))
    label = font.render('Next', 1, (0,0,0))
    for yh, piece in enumerate(shapes):
        format = get_format(piece)
        pygame.draw.rect(surface, board_color, (15 * block_size, block_size * 2 + yh * 3 * block_size, 2 * block_size, 2 * block_size))
        draw_grid(surface, 4, 4, 15 * block_size, 2 * block_size + yh * 3 * block_size, 2 * block_size, 2 * block_size, block_size / 2)
        for i, line in enumerate(format):
            row = list(line)
            for j, column in enumerate(row):
                if column == 'o':
                    pygame.draw.rect(surface, piece.color, (15 * block_size + j*block_size/2, 2 * block_size + i*block_size/2 + yh * 3 * block_size, block_size / 2, block_size / 2), 0)
                    pygame.draw.rect(surface, (0,0,0), (15 * block_size + j*block_size/2, 2 * block_size + i*block_size/2 + yh * 3 * block_size, block_size / 2, block_size / 2), int(block_size / 15))
            pygame.draw.rect(surface, (0,0,0), (15 * block_size, 2 * block_size + yh * 3 * block_size, 2 * block_size, 2 * block_size), int(block_size / 10))

    surface.blit(label, (15 * block_size, block_size / 2))

def draw_hold_shape(piece, surface):
    font = pygame.font.SysFont('Arial', int(block_size * 40 / 30))
    label = font.render('Hold', 1, (0,0,0))
    pygame.draw.rect(surface, board_color, (block_size, 2 * block_size, 2 * block_size, 2 * block_size))
    draw_grid(surface, 4, 4, block_size, 2 * block_size , 2 * block_size, 2 * block_size, block_size / 2)
    if piece != null:
        format = get_format(piece)
        pygame.draw.rect(surface, board_color, (block_size, 2 * block_size, 2 * block_size, 2 * block_size), int(block_size / 10))
        for i, line in enumerate(format):
            row = list(line)
            for j, column in enumerate(row):
                if column == 'o':
                    pygame.draw.rect(surface, piece.color, (block_size + j*block_size/2, 2 * block_size + i*block_size/2, block_size / 2, block_size / 2), 0)
                    pygame.draw.rect(surface, (0,0,0), (block_size + j*block_size/2, 2 * block_size + i*block_size/2, block_size / 2, block_size / 2), int(block_size / 15))

    surface.blit(label, (block_size, block_size / 2))
    pygame.draw.rect(surface, (0,0,0), (block_size, 2 * block_size, 2 * block_size, 2 * block_size), int(block_size / 10))

def draw_ghost(piece, grid, surface):
    ghost = copy.deepcopy(piece)
    while is_valid(ghost, grid, piece):
        ghost.y += 1
    ghost.y -= 1
    format = get_format(ghost)
    for i, line in enumerate(format):
            row = list(line)
            for j, column in enumerate(row):
                if column == 'o':
                    pygame.draw.rect(surface, (0,0,0), (top_left_x + j * block_size + ghost.x * block_size, top_left_y + i * block_size + ghost.y * block_size, block_size, block_size), int(block_size / 10))
*/ 
draw_window = function(g) {
    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGrid(top_left_x, top_left_y);
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (g[i][j] != board_color) { drawSquareAt(top_left_x + j * block_size, top_left_y + i * block_size, g[i][j]) }
        }
    }
    /*
    for i in range(len(g)):
        for j in range(len(g[i])):
            if g[i][j] != board_color:
                pygame.draw.rect(surface, (0,0,0), (top_left_x + j* block_size, top_left_y + i * block_size, block_size, block_size), int(block_size / 10))
    pygame.draw.rect(surface, (0, 0, 0), (top_left_x, top_left_y, play_width, play_height), int(block_size / 6))
    */
}

redraw = function(w, n, h, g) {
    draw_window(w, g);
    // draw_next_shapes(n, w)
    // draw_hold_shape(h, w)
}

let args = [0, 0, 0, 0, 0];
let score = 0;
let locked_positions = {};
let grid = get_grid();
let bag = get_new_bag();
let c_piece = get_next_piece(bag);
let n_piece = get_next_piece(bag);
let h_piece = null;
let lines_clear = 0;
let lost = false;
let change = false;
let hold_valid = true;
let up_locked = false;
let update_time = 0;
let best_move = null; // get_best_move(get_raw_moves(c_piece, n_piece));

reset = function() {
    locked_positions = {};
    grid = get_grid();
    bag = get_new_bag();
    c_piece = get_next_piece(bag);
    n_piece = get_next_piece(bag);
    h_piece = null;
    lines_clear = 0;
    lost = false;
    change = false;
    hold_valid = true;
    up_locked = false;
    update_time = 0;
    best_move = get_best_move(get_raw_moves(c_piece, n_piece));
}

move_left = function() {
    if (up_locked || change) { return }
    c_piece.move_left();
    if (!is_valid(c_piece, grid)) {
        c_piece.move_right();
    }
}

move_right = function() {
    if (up_locked || change) { return }
    c_piece.move_right();
    if (!is_valid(c_piece, grid)) {
        c_piece.move_left();
    }
}

soft_drop = function() {
    if (up_locked || change) { return }
    c_piece.move_down();
    if (!is_valid(c_piece, grid)) {
        c_piece.move_up();
        change = true;
    }
}

hard_drop = function() {
    up_locked = true;
    while (is_valid(c_piece, grid)) {
        c_piece.move_down();
    }
    c_piece.move_up();
    change = true;
}

spin_left = function() {
    if (up_locked || change) { return; }
    spin_left_handler(c_piece, grid);
}

spin_right = function() {
    if (up_locked || change) { return; }
    spin_right_handler(c_piece, grid);
}

hold = function() {
    if (hold_valid && !up_locked && !change) {
        remove_piece(grid, c_piece);
        hold_valid = false;
        if (h_piece == null) {
            h_piece = c_piece;
            h_piece.x = starting_positions[0];
            h_piece.y = starting_positions[1];
            c_piece = n_piece;
            n_piece = get_next_piece(bag);
        } else {
            var temp_piece = h_piece;
            h_piece = c_piece;
            c_piece = temp_piece;
            c_piece.x = starting_positions[0];
            c_piece.y = starting_positions[1];
        }
    }
}

get_x_coords = function(p, g) {
    xs = []
    for (let i = -2; i < 12; i++) {
        p.x = i
        if (is_valid(p, g)) {
            xs.push(i)
        }
    }
    return xs
}

get_raw_moves = function(p1, p2) {
    let moves = {};
    let clone_c_piece = Object.assign({}, p1);
    let clone_grid_prime = structuredClone(grid);
    let clone_locked_positions = structuredClone(locked_positions);
    for (let current_piece_index = 0; current_piece_index < 2; current_piece_index++) {
        if (current_piece_index == 1) { clone_c_piece = Object.assign({}, p2); } 
        for (let current_spin = 0; current_spin < 4; current_spin++) {
            clone_c_piece.spin_right();
            let possible_x = []
            while (is_valid(clone_c_piece, clone_grid_prime)) {
                clone_c_piece.move_left();
            }
            clone_c_piece.move_right();
            while(is_valid(clone_c_piece, clone_grid_prime)) {
                possible_x.push(clone_c_piece.x);
                clone_c_piece.move_right()
            }
            for (let current_x of possible_x) {
                // console.log(current_x);
                // console.log(current_x);
                clone_c_piece.x = parseInt(current_x);
                clone_c_piece.y = 0;
                let x_clone_locked_positions = structuredClone(clone_locked_positions);
                let clone_grid = structuredClone(clone_grid_prime);
                while(is_valid(clone_c_piece, clone_grid)) {
                    clone_c_piece.move_down();
                }
                clone_c_piece.move_up();
                // console.log(clone_c_piece);
                let current_positions = get_piece_positions(clone_c_piece);
                // console.log(current_positions);
                for (let pos_index = 0; pos_index < 4; pos_index++) {
                    x_clone_locked_positions[current_positions[pos_index]] = clone_c_piece.color;
                }
                // console.log(clone_c_piece.spin);
                moves[[clone_c_piece.spin, current_x, clone_c_piece.shape]] = get_grid(x_clone_locked_positions);
            }
        }
    }
    // console.log(moves);
    return moves
}

sum = function(a) {
    return a.reduce((partialSum, a) => partialSum + a, 0);
}

vari = function(a) {
    if (a.length == 0) { return 0; }
    let total = 0;
    let avg = sum(a) / a.length;
    for (let i = 0; i < a.length; i++) {
        total += (a[i] - avg) ** 2;
    }
    return total / a.length;
}

get_board_score = function(b) {
    let board_height = 20;
    let holes = 0;
    let clears = 0
    for (let row = 0; row < 20; row++) {
        if (!b[row].includes(board_color)) { clears++; }
        for (let col = 0; col < 10; col++) {
            if (b[row][col] != board_color) {
                if (row < board_height) {
                    board_height = row;
                }
                let ti = row + 1
                while (ti < b.length - 1) {
                    if (b[ti][col] == board_color) {
                        holes++;
                    }
                    ti++;
                }
            }
        }
    }
    let bumps = []
    for (let col = 0; col < b[0].length; col++) {
        for (let row = 0; row < b.length; row++) {
            if (b[row][col] != board_color) {
                bumps.push(b.length - row);
                continue;
            }
        }
    }
    let bumpiness = 0
    if (bumps.length != 0) {
        let total_bump = 0
        for (let bump_index = 0; bump_index < bumps.length; bump_index++) {
            total_bump += Math.abs(bumps[bump_index] - (sum(bumps) / bumps.length));
        }
        bumpiness = total_bump;
    }
    let wells = vari(bumps);
    if (isNaN(wells)) {
        wells = 0;
    }
    return board_height * args[0] - bumpiness * args[1] - holes * args[2] - wells * args[3] + clears * args[4];
}

function get_best_move(moves) {
    let best_move = null;
    let high_score = -Number.MAX_SAFE_INTEGER;
    for (let move in moves) {
        // console.log(moves[move]);
        let score = get_board_score(moves[move]);
        if (score > high_score) {
            let m = move.split(',');
            best_move = [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];
            high_score = score;
        }
    }
    return best_move
}

make_move = function(move) {
    if (move == null) {
        console.log('ah');
        reset();
    } else {
        // console.log(move)
        // o-piece tries to take x = 8 but can only get to x = 7, probably related to the use of true_dist functions
        let spin = move[0]
        let x = move[1]
        let piece = move[2]
        if (c_piece.shape != piece) {
            hold();
        } else if (c_piece.spin != spin) {
            spin_right();
        } else if (c_piece.x < x) {
            move_right();
        } else if (c_piece.x > x) {
            move_left();
        } else if (c_piece.x == x) {
            hard_drop();
        }
    }
}

play = function() {
    grid = get_grid(locked_positions);
    make_move(best_move);
    /*
    if (key == 'ArrowRight') {
        move_right();
    } else if (key == 'ArrowLeft') {
        move_left();
    } else if (key == 'ArrowUp') {
        hard_drop();
    } else if (key == 'x') {
        spin_right();
    } else if (key == 'c') {
        hold();
    }
    */
    update_time++;
    if (update_time % 3 == 0) { soft_drop(); }
    var shape_pos = get_piece_positions(c_piece);
    for(let i = 0; i < shape_pos.length; i++) {
        var x = shape_pos[i][0];
        var y = shape_pos[i][1];
        if (y > -1 && y < 20) {
            grid[y][x] = c_piece.color;
        }
    }
    if (change) {
        shape_pos.forEach(pos => {
            var p = Array(parseInt(pos[0]), parseInt(pos[1]));
            locked_positions[p] = c_piece.color;
        })
        c_piece = n_piece;
        n_piece = get_next_piece(bag);
        change = false;
        hold_valid = true;
        up_locked = false;

        let line_clears = clear_rows(grid, locked_positions);
        score += line_clears;
        document.getElementById('score_div').innerHTML = 'Lines cleared: ' + score;

        if (h_piece == null) {
            best_move = get_best_move(get_raw_moves(c_piece, n_piece));
        } else {
            best_move = get_best_move(get_raw_moves(c_piece, h_piece));
        }
    }

    redraw(grid);

    if (has_lost(locked_positions)) {
        reset();
    }
}

function start() {
    reset();
    FPS = 30;
    setInterval(play, 1000 / FPS);
}

document.addEventListener('DOMContentLoaded', function() {
    start();
}, false);

document.getElementById('go').addEventListener('click', function() {
    let new_args = [parseInt(document.getElementById('height').value),
    parseInt(document.getElementById('bumps').value),
    parseInt(document.getElementById('holes').value),
    parseInt(document.getElementById('wells').value),
    parseInt(document.getElementById('clears').value)];
    
    for (let c_arg = 0; c_arg < 5; c_arg++) {
        if (isNaN(new_args[c_arg])) {
            new_args[c_arg] = 0;
        }
    }

    args = new_args;
});

/*
document.addEventListener('keydown', function(event) {
    key = event.key; // "a", "1", "Shift", etc.
});

document.addEventListener('keyup', function(event) {
    key = null; // "a", "1", "Shift", etc.
});
*/

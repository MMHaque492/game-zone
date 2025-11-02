#include <napi.h>
#include <string>
#include <vector>
#include <random>
#include <chrono>

// Helper function to get a random number
int get_random(int min, int max) {
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::mt19937 generator(seed);
    std::uniform_int_distribution<int> distribution(min, max);
    return distribution(generator);
}

// --- Game Functions ---

// 1. Dice Roll
Napi::Number RollDice(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int roll = get_random(1, 6);
    return Napi::Number::New(env, roll);
}

// 2. Guess the Number (Generates a number)
Napi::Number GuessNumber(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int number = get_random(1, 100);
    return Napi::Number::New(env, number);
}

// 3. Rock Paper Scissors (Returns computer's move)
Napi::String GetRPSMove(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int move = get_random(0, 2); // 0 = rock, 1 = paper, 2 = scissors
    std::string result;
    if (move == 0) {
        result = "rock";
    } else if (move == 1) {
        result = "paper";
    } else {
        result = "scissors";
    }
    return Napi::String::New(env, result);
}

// 4. Tic-Tac-Toe Winner Check
// Expects a 9-element array (string) from JS: ["x", "", "o", "", "x", "o", "", "", "x"]
Napi::String CheckTicTacWinner(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsArray()) {
        Napi::TypeError::New(env, "Expected an array").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    Napi::Array board = info[0].As<Napi::Array>();
    if (board.Length() != 9) {
        Napi::TypeError::New(env, "Array must have 9 elements").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    std::vector<std::string> b;
    for (uint32_t i = 0; i < 9; i++) {
        b.push_back(board.Get(i).As<Napi::String>().Utf8Value());
    }

    // Winning combinations
    const int wins[8][3] = {
        {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // rows
        {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // cols
        {0, 4, 8}, {2, 4, 6}  // diagonals
    };

    std::string winner = "";
    for (int i = 0; i < 8; i++) {
        if (b[wins[i][0]] != "" &&
            b[wins[i][0]] == b[wins[i][1]] &&
            b[wins[i][0]] == b[wins[i][2]]) {
            winner = b[wins[i][0]];
            break;
        }
    }

    // Check for draw
    if (winner == "") {
        bool isDraw = true;
        for (uint32_t i = 0; i < 9; i++) {
            if (b[i] == "") {
                isDraw = false;
                break;
            }
        }
        if (isDraw) {
            winner = "draw";
        }
    }

    return Napi::String::New(env, winner);
}


// --- Export ---

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "rollDice"), Napi::Function::New(env, RollDice));
    exports.Set(Napi::String::New(env, "guessNumber"), Napi::Function::New(env, GuessNumber));
    exports.Set(Napi::String::New(env, "getRPSMove"), Napi::Function::New(env, GetRPSMove));
    exports.Set(Napi::String::New(env, "checkTicTacWinner"), Napi::Function::New(env, CheckTicTacWinner));
    return exports;
}

NODE_API_MODULE(game_addon, Init)

/*
 Kids Math App
 Author: Bhaskar Joshi
 Email: bhaskarjoshi2024@gmail.com
 License: MIT
*/

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();

    var valid_operators = {
        "addition": `<i class="fas fa-plus"></i>`,
        "substraction": `<i class="fas fa-minus"></i>`,
        "multiplication": `<i class="fas fa-times"></i>`,
        "division": `<i class="fas fa-divide"></i>`
    };

    var quiz_data = [];
    var quiz_settings = {};
    $('#celebration_deck').hide();

    function display_celebration_effects(){
        var end = Date.now() + (5 * 1000);
        var colors = ['#FF0000', '#093657', '#D7B030'];
        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
                disableForReducedMotion: true
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
                disableForReducedMotion: true
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function display_celebration_message(){
        $('#celebration_deck').slideDown("slow");
    }

    function celebrate(){
        display_celebration_effects();
        display_celebration_message();
    }

    function get_random_integer(min_number, max_number){
        return Math.floor(Math.random() * (max_number - min_number + 1) + min_number);
    }

    function get_random_operator(operators){
        operator = operators[Math.floor(Math.random() * operators.length)]
        if(valid_operators.hasOwnProperty(operator)){
            return valid_operators[operator];
        }
        valid_operators_keys = Object.keys(valid_operators);
        var random_index = Math.floor(Math.random() * valid_operators_keys.length);
        random_operator = valid_operators[valid_operators_keys[random_index]];
        return random_operator;
    }

    function get_correct_answer(operand_1, operand_2, operator){
        correct_answer = NaN;
        switch (operator) {
            case valid_operators["addition"]:
                correct_answer = operand_1 + operand_2;
                break;
            case valid_operators["substraction"]:
                correct_answer = operand_1 - operand_2;
                break;
            case valid_operators["multiplication"]:
                correct_answer = operand_1 * operand_2;
                break;
            case valid_operators["division"]:
                correct_answer = Math.floor(operand_1 / operand_2);
                break;
        }
        return correct_answer;
    }

    function get_a_quiz_row(question){
        return `<tr class="quiz_row bg-dark text-white text-center align-items-center">
        <td>${question["operand_1"]}</td>
        <td>${question["operator"]}</td>
        <td>${question["operand_2"]}</td>
        <td><i class="fas fa-equals"></i></td>
        <td>
            <input id="${question["question_id"]}"
            class="answer_input form-control"
            type="number" tabindex="${question["question_id"]+1}">
        </td>
        <td>
            <button class="btn btn-light"><i class="fa fa-2x fa-calculator"></i></button>
        </td>
        </tr>`;
    }

    function get_quiz_settings(){
        $max_number_operand_1 = parseInt($("#max_number_operand_1").val());
        if(isNaN($max_number_operand_1)) $max_number_operand_1 = 30;

        $max_number_operand_2 = parseInt($("#max_number_operand_2").val());
        if(isNaN($max_number_operand_2)) $max_number_operand_2 = 10;

        $number_of_questions = parseInt($("#number_of_questions").val());
        $type_of_questions = $("#type_of_questions").val();
        if($type_of_questions.length === 0){
            $type_of_questions = ["random"];
        }

        return {
            "max_number_operand_1": $max_number_operand_1,
            "max_number_operand_2": $max_number_operand_2,
            "number_of_questions": $number_of_questions,
            "type_of_questions": $type_of_questions,
            "quiz_language": "en"
        };
    }

    function get_quiz_data(){
        data = [];
        operators = quiz_settings["type_of_questions"];
        max_number_operand_1 = quiz_settings["max_number_operand_1"];
        max_number_operand_2 = quiz_settings["max_number_operand_2"];
        min_number = 0;
        for(var i = 0; i < quiz_settings["number_of_questions"]; i++){
            var question = {};
            var operand_1 = get_random_integer(min_number, max_number_operand_1);
            var operand_2 = get_random_integer(min_number, max_number_operand_2);
            var operator = get_random_operator(operators);

            if(operator == valid_operators["division"] && operand_2 == 0){
                operand_2 = 1;
            }

            question["correct_answer"] = get_correct_answer(operand_1, operand_2, operator);
            question["operand_1"] = operand_1;
            question["operand_2"] = operand_2;
            question["operator"] = operator;
            question["question_id"] = i;
            data.push(question);
        }
        return data;
    }

    $("#generate_quiz").on("click", function(){
        quiz_settings = get_quiz_settings();
        $("#quiz_wrapper").removeClass("invisible");
        $("#quiz_settings_box").collapse('hide');
        quiz_data = get_quiz_data();
        $("#quiz_rows").html("");
        for(i = 0; i < quiz_data.length; i++){
            $("#quiz_rows").append(get_a_quiz_row(quiz_data[i]));
        }
        $("#celebration_message").html("Very good!");
        $("#correct_answers_title").html("Correct Answer");
        $("#wrong_answers_title").html("Wrong Answer");
        $("#correct_answers_value").html(0);
        $("#wrong_answers_value").html(0);
        $(".answer_input")[0].focus();
        $('#celebration_deck').hide();
    });

    $("body").on("focusout", "input.answer_input", function(){
        current_value = $(this).val();
        question_id = parseInt($(this).attr("id"));
        correct_anwer = quiz_data[question_id]["correct_answer"].toString();

        total_correct_old = $(".quiz_row.bg-success").length;
        total_wrong_old = $(".quiz_row.bg-danger").length;

        if(current_value === correct_anwer){
            $(this).closest(".quiz_row").removeClass("bg-dark bg-danger").addClass("bg-success");
        }
        else{
            $(this).closest(".quiz_row").removeClass("bg-dark bg-success").addClass("bg-danger");
        }

        total_correct_new = $(".quiz_row.bg-success").length;
        if(total_correct_new == quiz_data.length){
            celebrate();
        }

        total_wrong_new = $(".quiz_row.bg-danger").length;
        if(total_correct_new !== total_correct_old){
            $("#correct_answers_card").fadeOut();
            $("#correct_answers_value").html(total_correct_new);
            $("#correct_answers_card").fadeIn();
        }
        if(total_wrong_new !== total_wrong_old){
            $("#wrong_answers_card").fadeOut();
            $("#wrong_answers_value").html(total_wrong_new);
            $("#wrong_answers_card").fadeIn();
        }
    });

    $("body").on("keyup", "input.answer_input", function(event){
        question_id = parseInt($(this).attr("id"));
        total_anwer_input = $(".answer_input").length;
        switch (event.which) {
            case 37:
                prev_question = question_id-1;
                if(prev_question>=0) $("#"+prev_question).focus();
                break;
            case 39:
                next_question = question_id+1;
                if(next_question<total_anwer_input) $("#"+next_question).focus();
                break;
        }
    });

});

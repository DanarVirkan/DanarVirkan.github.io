import { loadMatches } from './API.js'
export default class Filter {
    constructor(stage, group = null) {
        switch (stage) {
            case 'PRELIMINARY_SEMI_FINALS':
                this.setFilter(`
                    <button class="btn orange waves-effect" disabled load="PRELIMINARY_SEMI_FINALS">Semi-finals</button>
                    <button class="btn orange waves-effect" load="PRELIMINARY_FINAL">Final</button>
                `);
                break;
            case 'PRELIMINARY_FINAL':
                this.setFilter(`
                    <button class="btn orange waves-effect"  load="PRELIMINARY_SEMI_FINALS">Semi-finals</button>
                    <button class="btn orange waves-effect" disabled load="PRELIMINARY_FINAL">Final</button>
                `);
                break;
            case '1ST_QUALIFYING_ROUND':
                this.setFilter(`
                    <button class="btn orange waves-effect" disabled load="1ST_QUALIFYING_ROUND">1st Round</button>
                    <button class="btn orange waves-effect" load="2ND_QUALIFYING_ROUND">2nd Round</button>
                    <button class="btn orange waves-effect" load="3RD_QUALIFYING_ROUND">3rd Round</button>
                `);
                break;
            case '2ND_QUALIFYING_ROUND':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="1ST_QUALIFYING_ROUND">1st Round</button>
                    <button class="btn orange waves-effect" disabled load="2ND_QUALIFYING_ROUND">2nd Round</button>
                    <button class="btn orange waves-effect" load="3RD_QUALIFYING_ROUND">3rd Round</button>
                `);
                break;
            case '3RD_QUALIFYING_ROUND':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="1ST_QUALIFYING_ROUND">1st Round</button>
                    <button class="btn orange waves-effect" load="2ND_QUALIFYING_ROUND">2nd Round</button>
                    <button class="btn orange waves-effect" disabled load="3RD_QUALIFYING_ROUND">3rd Round</button>
                `);
                break;
            case 'GROUP_STAGE':
                break;
            default:
                this.removeFilter();
                return;
        }
        switch (group) {
            case 'A':
                this.setFilter(`
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'B':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'C':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'D':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'E':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'F':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'G':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            case 'H':
                this.setFilter(`
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="A">A</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="B">B</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="C">C</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="D">D</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="E">E</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="F">F</button>
                    <button class="btn orange waves-effect" load="GROUP_STAGE" group="G">G</button>
                    <button class="btn orange waves-effect" disabled load="GROUP_STAGE" group="H">H</button>
                `);
                break;
            default:
                break;
        }
    }


    listener(page) {
        let allBTN = $(`${page} button[load]`);
        allBTN.click(function() {
            allBTN.removeAttr('disabled');
            $(this).attr('disabled', 'disabled');

            let load = $(this).attr('load');
            if (load == 'GROUP_STAGE') {
                loadMatches(load, $(this).attr('group'));
            } else {
                loadMatches(load);
            }
        });
    }

    removeFilter() {
        this.filter = '';
    }

    getFilter() {
        return this.filter;
    }

    setFilter(stage) {
        this.filter = `
            <div class="col s12" style="margin:1rem 0;">
                ${stage}
            </div>
        `;
    }
}
import { NgModule } from '@angular/core';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { TableExternalComponent } from './components/table-external/table-external.component';
import { FilterGroupExternalComponent } from './components/filter-group-external/filter-group-external.component';
import {TableModule} from 'primeng/table';
import { DropdownExternal } from './components/dropdown-external/dropdown-external.component';
import { ChartsExternalComponent } from './components/charts-external/charts-external.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CharTextComponent } from './components/char-text/char-text.component';

import {PasswordModule} from 'primeng/password';
import {DropdownModule} from 'primeng/dropdown';
import { DialogService, DynamicDialog } from 'primeng/dynamicdialog';
import { RowDataHandlerDirective } from './components/table-external/rowDataHandler/row-data-handler.directive';
import { IframeExternalComponent } from './components/iframe-external/iframe-external.component';
import { ListPipe } from './pipes/list/list.pipe';
import { GenerateWithAiComponent } from './components/generate-with-ai/generate-with-ai.component';
import { StackblitzEditorComponent } from './components/stackblitz-editor/stackblitz-editor.component';
import { IMPORT_MODULES } from './constant/stackblitz-constant';
import { StaticTextComponent } from './components/static-text/static-text.component';
import { DynamicStringPipe } from './pipes/dynamic-string.pipe';

import { StaticImageComponent } from './components/static-image/static-image.component';
import { StaticIconComponent } from './components/static-icon/static-icon.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioComponent } from './components/radio/radio.component';
import { NavItemGroupComponent } from './components/nav-item-group/nav-item-group.component';
import { ButtonComponent } from './components/button/button.component';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { providePrimeNG } from 'primeng/config';
import CustomPreset from './custom-theme';

@NgModule({
    declarations: [
        PasswordExternalComponent,
        TextExternalComponent,
        TableExternalComponent,
        FilterGroupExternalComponent,
        DropdownExternal,
        ChartsExternalComponent,
        RowDataHandlerDirective,
        IframeExternalComponent,
        ListPipe,
        GenerateWithAiComponent,
        StackblitzEditorComponent,
        StaticTextComponent,
        DynamicStringPipe,
        DropdownComponent,
        CharTextComponent,
        StaticImageComponent,
        StaticIconComponent,
        CheckboxComponent,
        RadioComponent,
        NavItemGroupComponent,
        ButtonComponent,
        DateTimeComponent,
        FileUploadComponent,
        TypeaheadComponent,
        NavMenuComponent
    ],
    imports: IMPORT_MODULES,
    exports: [
        PasswordExternalComponent,
        TextExternalComponent,
        TableExternalComponent,
        FilterGroupExternalComponent,
        TableModule,
        DropdownExternal,
        IframeExternalComponent,
        ChartsExternalComponent, PasswordModule, DropdownModule,
        GenerateWithAiComponent, StaticTextComponent, DropdownComponent,
        CharTextComponent, StaticImageComponent, StaticIconComponent,
        CheckboxComponent, RadioComponent, NavItemGroupComponent,
        ButtonComponent, DateTimeComponent, FileUploadComponent,
        TypeaheadComponent, NavMenuComponent
    ],
    providers: [
        DialogService,
        providePrimeNG({ 
            theme: {
                preset: CustomPreset
            }
        }) 
    ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external

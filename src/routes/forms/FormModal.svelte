<script lang="ts">
    import { closeModal, Grav_Modal } from "$lib/index.js";
    import InputFormBool from "$lib/Inputs/InputFormBool.svelte";
    import InputFormCascade from "$lib/Inputs/InputFormCascade.svelte";
    import InputFormColor from "$lib/Inputs/InputFormColor.svelte";
    import InputFormDate from "$lib/Inputs/InputFormDate.svelte";
    import InputFormDateAndHours from "$lib/Inputs/InputFormDateAndHours.svelte";
    import InputFormImage from "$lib/Inputs/InputFormImage.svelte";
    import InputFormNumber from "$lib/Inputs/InputFormNumber.svelte";
    import InputFormPassword from "$lib/Inputs/InputFormPassword.svelte";
    import InputFormSelect from "$lib/Inputs/InputFormSelect.svelte";
    import InputFormText from "$lib/Inputs/InputFormText.svelte";
    import InputFormTextArea from "$lib/Inputs/InputFormTextArea.svelte";

    export let modalConfig = {
        title: "Form Modal",
        size: "md",
        isVista: false,
        loading: false,
        saveButtonDisabled: false,
        saveButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    };

    let textInput = "";
    let numberInput: number = 0;
    let boolInput = false;
    let colorInput = "#000000";
    let dateInput: string = "";
    let dateTimeInput: string = "";
    let imageInput: HTMLInputElement;
    let selectInput: SelectValue | null = null;
    let textAreaInput = "";
    let cascadeInput: Record<string, string | null> = {};
    let passwordInput = "";

    interface SelectValue {
        value: string;
        label: string;
    }
</script>

<Grav_Modal
    {...modalConfig}
    onClose={() => {
        closeModal("formModal");
    }}
    onSave={() => {
        alert("Form saved!");
        closeModal("formModal");
    }}
>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Form Modal Content</h2>
        <p class="text-gray-600 ">
            This is the Form Modal. You can add form components and
            functionality here.
        </p>
        <div class="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <InputFormNumber icon="fas fa-user" label="Number Input" bind:valueVar={numberInput} />
            <InputFormTextArea rows={3} label="Text Area Input" bind:valueVar={textAreaInput} />
            <InputFormDateAndHours icon="fas fa-user" label="Date and Hours Input" bind:valueVar={dateTimeInput} />
            <InputFormColor icon="fas fa-user" label="Color Input" bind:valueVar={colorInput} />
            <InputFormImage  bind:valueVar={imageInput} />
            <InputFormBool  label="Boolean Input" bind:valueVar={boolInput} />
            <InputFormDate icon="fas fa-user" label="Date Input" bind:valueVar={dateInput} />
            <!-- <InputFormCascade icon="fas fa-user" label="Cascade Input" bind:valueVar={cascadeInput} /> -->
            <InputFormPassword icon="fas fa-user"label="Password Input" bind:valueVar={passwordInput} />
            <InputFormSelect label="Select Input" bind:valueVar={selectInput} />
            <InputFormText label="Text Input" bind:valueVar={textInput} />
        </div>
    </div>
</Grav_Modal>


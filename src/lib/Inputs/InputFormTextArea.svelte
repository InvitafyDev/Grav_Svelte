<script lang="ts">
    export let valueVar: string = "";
    export let label: string;
    export let disabled = false;
    export let obligatory = false;
    export let rows: number = 3;
</script>

<div class="relative z-0 mt-4">
    <textarea
        {disabled}
        id={valueVar}
        bind:value={valueVar}
        name={valueVar}
        {rows}
        placeholder=" "
        class="block pt-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
    />
    <label
        for={valueVar}
        class="absolute text-base text-gray-600 duration-300 transform -translate-y-6 scale-75 top-2.5 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >{label}
        {#if obligatory}
            <span class="text-red-600"> *</span>
        {/if}</label
    >
</div>

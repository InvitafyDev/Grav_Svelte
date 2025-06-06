<script lang="ts">
    export let valueVar: string = "";
    export let label: string;
    export let disabled = false;
    export let obligatory = false;
</script>

<div class="relative z-0 my-auto mt-3">
    <input
        {disabled}
        type="text"
        bind:value={valueVar}
        placeholder=" "
        class="block pt-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
    />

    <label
        for={valueVar}
        class="absolute text-base text-left text-black duration-300 transform -translate-y-5 scale-75 top-2.5 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
        >{label}
        {#if obligatory}
            <span class="text-red-600"> *</span>
        {/if}</label
    >
</div>

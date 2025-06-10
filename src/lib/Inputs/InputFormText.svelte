<script lang="ts">
    export let valueVar: string = "";
    export let label: string;
    export let disabled = false;
    export let obligatory = false;
    export let inputType: "text" | "password" = "text";
    export let icon: string | null = null;
</script>

<div class="flex items-center mt-3 border-0 border-b-2 border-gray-400">
    {#if icon}
        <div class="w-4 relative mr-2">
            <i class="{icon} absolute -top-1 left-1"></i>
        </div>
    {/if}
    <div class="relative z-0 w-full">
        <input
            {disabled}
            type={inputType}
            bind:value={valueVar}
            placeholder=" "
            class="block pt-2.5 px-0 w-full text-base text-gray-900 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
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
</div>

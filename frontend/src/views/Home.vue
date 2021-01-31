<template>
  <div class="home">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box notification is-primary">
          <p class="title">Warehouse Manager</p>
          <p class="subtitle">De mi ez az egész?</p>
          <div class="content">
            <p>
              A Warehouse Manager egy kis projekt alapú cég számára megoldás,
              ahol nyomon tudja követni az aktuális készleteit és azok helyeit
              több raktáron keresztül.
            </p>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box notification is-info is-light">
          <p class="title">Termékek</p>
          <p class="subtitle">És kategóriák</p>
          <div class="content">
            <p>
              Minden termékhez hozzátartozik egy kategória is, amivel
              átláthatóbb a rendszer. A termékek mozgását egy külön oldalon meg
              is lehet tekinteni, így látható ki adott hozzá vagy vett el éppen
              valamit.
            </p>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box notification is-success is-light">
          <p class="title">Projektek</p>
          <p class="subtitle">Amolyan mini raktárak</p>
          <div class="content">
            <p>
              Mivel projekt alapú a cég, ezért azok is nyomon követhetőek. Egy
              projekthez hozzá lehet csatolni termékeket (akár egyedi árral),
              résztvevőket kiválaszthatjuk, akár kedvezményt is adhatunk az
              egész projektre. Ezzel a "modullal" egyfajta árajánlat is
              generálható nyomtatható formátumban. (Ctrl + P)
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>

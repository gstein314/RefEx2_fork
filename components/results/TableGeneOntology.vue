<template>
  <div>
    <table v-if="dataSource">
      <thead>
        <tr>
          <th class="id">ID</th>
          <th>Terms</th>
          <th class="evidence">Evidence</th>
          <th class="qualifier">Qualifier</th>
        </tr>
      </thead>
      <tbody v-if="Array.isArray(dataSource[typeUpper])">
        <tr v-for="(typeLower, index) in dataSource[typeUpper]" :key="index">
          <td class="id">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${typeLower.id}`"
              target="_blank"
              >{{ typeLower.id }}
            </a>
          </td>
          <td>{{ typeLower.term }}</td>
          <td class="evidence">{{ typeLower.evidence }}</td>
          <td class="qualifier">{{ typeLower.qualifier }}</td>
        </tr>
      </tbody>
      <tbody v-else-if="dataSource[typeUpper]">
        <tr>
          <td class="id">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${dataSource[typeUpper].id}`"
              target="_blank"
              >{{ dataSource[typeUpper].id }}
            </a>
          </td>
          <td>{{ dataSource[typeUpper].term }}</td>
          <td class="evidence">{{ dataSource[typeUpper].evidence }}</td>
          <td class="qualifier">{{ dataSource[typeUpper].qualifier }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      dataSource: {
        type: Object,
        default: () => {},
      },
      typeUpper: {
        type: String,
        default: () => {},
      },
    },
  };
</script>

<style lang="sass" scoped>
  table
    font-size: 14px
    border-spacing: 0px 10px
    width: 100%
    table-layout: auto
    > thead,tbody
      .id
        width: 90px
      .evidence
        width: 70px
      .qualifier
        width: 105px
    > thead
      text-align: left
    > tbody
      vertical-align: top
</style>

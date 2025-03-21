<template>
  <router-link to="/users/EventPage">
    <button class="profile-button"> Profil</button>
  </router-link>
</template>

<script>

</script>

<style scoped>
.profile-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.profile-button:hover {
  background-color: #0056b3;
}

.icon {
  margin-right: 10px;
}
</style>

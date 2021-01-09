module.exports = (permissions, player) => {
    return permissions.filter(p => !player.permissions.includes(p)).length === 0;
};
